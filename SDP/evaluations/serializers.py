from rest_framework import serializers
from .models import EvaluationCategory, EvaluationQuestion, EvaluationSession, EvaluationResponse, StaffResponse


class EvaluationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCategory
        fields = ["id", "name", "description", "is_active"]


class EvaluationQuestionSerializer(serializers.ModelSerializer):
    category = EvaluationCategorySerializer(read_only=True)

    class Meta:
        model = EvaluationQuestion
        fields = [
            "id",
            "department",
            "category",
            "prompt",
            "scale_type",
            "order_index",
            "is_active",
        ]


class EvaluationResponseInputSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    score = serializers.IntegerField(required=False, allow_null=True)
    boolean_answer = serializers.BooleanField(required=False)
    text_answer = serializers.CharField(required=False, allow_blank=True)


class EvaluationSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationSession
        fields = [
            "id",
            "student",
            "department",
            "evaluation_key",
            "status",
            "started_at",
            "submitted_at",
        ]
        read_only_fields = ["status", "started_at", "submitted_at"]


class StaffResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffResponse
        fields = ["id", "session", "responder", "message", "created_at"]
        read_only_fields = ["created_at"]


