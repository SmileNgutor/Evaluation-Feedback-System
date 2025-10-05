from django.db import transaction
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
import csv

from authentication.decorators import ajax_login_required, ajax_role_required
from authentication.models import Department, EvaluationKey, AUNUser
from authentication.utils import encrypt_for_anonymity

from .models import (
    EvaluationCategory,
    EvaluationQuestion,
    EvaluationSession,
    EvaluationResponse,
    StaffResponse,
)
from .serializers import (
    EvaluationQuestionSerializer,
    EvaluationResponseInputSerializer,
    StaffResponseSerializer,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def list_questions(request):
    """Public: list active questions for a department (optional by category)."""
    department_id = request.GET.get("department_id")
    if not department_id:
        return Response({"success": False, "message": "department_id is required"}, status=400)

    category_id = request.GET.get("category_id")
    qs = EvaluationQuestion.objects.filter(department_id=department_id, is_active=True)
    if category_id:
        qs = qs.filter(category_id=category_id)

    data = EvaluationQuestionSerializer(qs.order_by("order_index", "id"), many=True).data
    return Response({"success": True, "data": {"questions": data, "count": len(data)}})


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_evaluation(request):
    """Student: start an evaluation session after validating key."""
    user: AUNUser = request.user
    if not user.is_student or not user.is_verified:
        return Response({"success": False, "message": "Only verified students can start evaluations."}, status=403)

    department_id = request.data.get("department_id")
    key = (request.data.get("key") or "").strip().upper()
    if not department_id or not key:
        return Response({"success": False, "message": "department_id and key are required."}, status=400)

    department = get_object_or_404(Department, id=department_id, is_active=True)
    try:
        eval_key = EvaluationKey.objects.get(key=key, department=department)
    except EvaluationKey.DoesNotExist:
        return Response({"success": False, "message": "Invalid evaluation key for department."}, status=400)

    if not eval_key.is_valid:
        return Response({"success": False, "message": "Evaluation key expired or over limit."}, status=400)

    with transaction.atomic():
        eval_key.use_key()
        anon = user.get_encrypted_identity() or ""
        session = EvaluationSession.objects.create(
            student=user, department=department, evaluation_key=eval_key, anonymous_identity=anon
        )

    return Response({
        "success": True,
        "message": "Evaluation started.",
        "data": {"session_id": session.id}
    }, status=201)


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_evaluation(request):
    """Student: submit evaluation answers for a session."""
    user: AUNUser = request.user
    session_id = request.data.get("session_id")
    responses = request.data.get("responses", [])

    if not session_id or not isinstance(responses, list):
        return Response({"success": False, "message": "session_id and responses[] are required."}, status=400)

    session = get_object_or_404(EvaluationSession, id=session_id, student=user)
    if session.status == "submitted":
        return Response({"success": False, "message": "Session already submitted."}, status=400)

    # Ensure questions belong to the department
    question_ids = [r.get("question_id") for r in responses if r.get("question_id")]
    valid_questions = set(
        EvaluationQuestion.objects.filter(
            id__in=question_ids, department=session.department, is_active=True
        ).values_list("id", flat=True)
    )

    with transaction.atomic():
        for r in responses:
            ser = EvaluationResponseInputSerializer(data=r)
            ser.is_valid(raise_exception=True)
            qid = ser.validated_data["question_id"]
            if qid not in valid_questions:
                return Response({"success": False, "message": f"Invalid question {qid} for department."}, status=400)

            EvaluationResponse.objects.update_or_create(
                session=session,
                question_id=qid,
                defaults={
                    "score": ser.validated_data.get("score"),
                    "boolean_answer": ser.validated_data.get("boolean_answer"),
                    "text_answer": ser.validated_data.get("text_answer", ""),
                },
            )

        session.mark_submitted()

    return Response({"success": True, "message": "Evaluation submitted."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def department_analytics(request, department_id: int):
    """Staff/Head/Admin: basic aggregated metrics for a department."""
    user: AUNUser = request.user
    if not (user.is_admin or (user.is_staff_member and user.department_id == department_id)):
        return Response({"success": False, "message": "Forbidden."}, status=403)

    # Aggregations
    sessions = EvaluationSession.objects.filter(department_id=department_id, status="submitted")
    total_sessions = sessions.count()

    # Average score per question
    from django.db.models import Avg

    averages = (
        EvaluationResponse.objects.filter(session__in=sessions, score__isnull=False)
        .values("question_id", "question__prompt")
        .annotate(avg_score=Avg("score"))
        .order_by("question_id")
    )

    avg_list = [
        {"question_id": a["question_id"], "prompt": a["question__prompt"], "avg_score": round(a["avg_score"], 2)}
        for a in averages
    ]

    return Response({
        "success": True,
        "data": {
            "total_submissions": total_sessions,
            "question_averages": avg_list,
        },
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def staff_respond(request, session_id: int):
    """Staff/Head/Admin: respond to a submitted session (one reply)."""
    user: AUNUser = request.user
    session = get_object_or_404(EvaluationSession, id=session_id)
    if session.status != "submitted":
        return Response({"success": False, "message": "Session not submitted yet."}, status=400)

    if not (user.is_admin or (user.is_staff_member and user.department_id == session.department_id)):
        return Response({"success": False, "message": "Forbidden."}, status=403)

    message = (request.data.get("message") or "").strip()
    if not message:
        return Response({"success": False, "message": "message is required."}, status=400)

    sr, _ = StaffResponse.objects.update_or_create(
        session=session,
        defaults={"responder": user, "message": message},
    )

    return Response({"success": True, "data": {"id": sr.id, "created_at": sr.created_at}})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_department_sessions(request, department_id: int):
    """Staff/Head/Admin: list submitted sessions for a department with basic metadata."""
    user: AUNUser = request.user
    if not (user.is_admin or (user.is_staff_member and user.department_id == department_id)):
        return Response({"success": False, "message": "Forbidden."}, status=403)

    sessions = (
        EvaluationSession.objects.filter(department_id=department_id, status="submitted")
        .select_related("student")
        .order_by("-submitted_at")
    )

    data = [
        {
            "id": s.id,
            "submitted_at": s.submitted_at.isoformat() if s.submitted_at else None,
            "anonymous_identity": s.anonymous_identity,
            "has_staff_response": hasattr(s, "staff_response"),
            "student_role": s.student.role,
        }
        for s in sessions
    ]

    return Response({"success": True, "data": {"sessions": data, "count": len(data)}})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def session_detail(request, session_id: int):
    """Staff/Head/Admin: get responses of a specific session."""
    user: AUNUser = request.user
    session = get_object_or_404(EvaluationSession.objects.select_related("department"), id=session_id)
    if not (user.is_admin or (user.is_staff_member and user.department_id == session.department_id)):
        return Response({"success": False, "message": "Forbidden."}, status=403)

    responses = (
        EvaluationResponse.objects.filter(session=session)
        .select_related("question")
        .order_by("question__order_index")
    )

    data = [
        {
            "question_id": r.question_id,
            "prompt": r.question.prompt,
            "scale_type": r.question.scale_type,
            "score": r.score,
            "boolean_answer": r.boolean_answer,
            "text_answer": r.text_answer,
        }
        for r in responses
    ]

    staff_reply = None
    if hasattr(session, "staff_response"):
        staff_reply = {
            "responder": session.staff_response.responder.full_name if session.staff_response.responder else None,
            "message": session.staff_response.message,
            "created_at": session.staff_response.created_at.isoformat(),
        }

    return Response({
        "success": True,
        "data": {
            "session": {
                "id": session.id,
                "submitted_at": session.submitted_at.isoformat() if session.submitted_at else None,
                "anonymous_identity": session.anonymous_identity,
            },
            "responses": data,
            "staff_response": staff_reply,
        },
    })


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def manage_questions(request):
    """Admin/Dept Head: list or create questions for a department."""
    user: AUNUser = request.user
    if request.method == "GET":
        department_id = request.GET.get("department_id")
        if not department_id:
            return Response({"success": False, "message": "department_id is required"}, status=400)
        if not (user.is_admin or (user.is_department_head and user.department_id == int(department_id))):
            return Response({"success": False, "message": "Forbidden."}, status=403)

        qs = EvaluationQuestion.objects.filter(department_id=department_id).order_by("order_index", "id")
        data = EvaluationQuestionSerializer(qs, many=True).data
        return Response({"success": True, "data": {"questions": data, "count": len(data)}})

    # POST create
    payload = request.data
    department_id = payload.get("department_id")
    if not department_id:
        return Response({"success": False, "message": "department_id is required"}, status=400)
    if not (user.is_admin or (user.is_department_head and user.department_id == int(department_id))):
        return Response({"success": False, "message": "Forbidden."}, status=403)

    question = EvaluationQuestion.objects.create(
        department_id=department_id,
        category_id=payload.get("category_id"),
        prompt=payload.get("prompt", "").strip(),
        scale_type=payload.get("scale_type", "likert_5"),
        order_index=int(payload.get("order_index", 0)),
        created_by=user,
    )
    return Response({"success": True, "data": {"id": question.id}}, status=201)


@api_view(["PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def question_detail(request, question_id: int):
    """Admin/Dept Head: update or delete a question."""
    user: AUNUser = request.user
    question = get_object_or_404(EvaluationQuestion, id=question_id)
    if not (user.is_admin or (user.is_department_head and user.department_id == question.department_id)):
        return Response({"success": False, "message": "Forbidden."}, status=403)

    if request.method in ["PUT", "PATCH"]:
        payload = request.data
        for field in ["prompt", "scale_type", "order_index", "category_id", "is_active"]:
            if field in payload:
                if field == "order_index":
                    setattr(question, field, int(payload[field]))
                elif field == "category_id":
                    setattr(question, "category_id", payload[field])
                else:
                    setattr(question, field, payload[field])
        question.save()
        return Response({"success": True, "message": "Question updated."})

    # DELETE -> soft delete by deactivating
    question.is_active = False
    question.save(update_fields=["is_active"])
    return Response({"success": True, "message": "Question deactivated."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def export_department_csv(request, department_id: int):
    """Admin/Dept Head: export submitted sessions and responses as CSV."""
    user: AUNUser = request.user
    if not (user.is_admin or (user.is_department_head and user.department_id == department_id)):
        return Response({"success": False, "message": "Forbidden."}, status=403)

    # Build CSV
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="department_{department_id}_evaluations.csv"'
    writer = csv.writer(response)

    writer.writerow([
        "session_id",
        "submitted_at",
        "anonymous_identity",
        "question_id",
        "prompt",
        "scale_type",
        "score",
        "boolean_answer",
        "text_answer",
    ])

    sessions = EvaluationSession.objects.filter(department_id=department_id, status="submitted")
    responses = (
        EvaluationResponse.objects.filter(session__in=sessions)
        .select_related("question", "session")
        .order_by("session_id", "question__order_index")
    )

    for r in responses:
        writer.writerow([
            r.session_id,
            r.session.submitted_at.isoformat() if r.session.submitted_at else "",
            r.session.anonymous_identity,
            r.question_id,
            r.question.prompt.replace("\n", " ").strip(),
            r.question.scale_type,
            r.score if r.score is not None else "",
            r.boolean_answer if r.boolean_answer is not None else "",
            (r.text_answer or "").replace("\n", " ").strip(),
        ])

    return response


