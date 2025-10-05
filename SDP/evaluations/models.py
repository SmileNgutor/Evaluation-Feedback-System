from django.db import models
from django.utils import timezone


class EvaluationCategory(models.Model):
    """High-level grouping for questions, e.g., Teaching, Facilities, Support."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class EvaluationQuestion(models.Model):
    """Question bank per department and category."""
    SCALE_TYPES = [
        ("likert_5", "Likert 1-5"),
        ("likert_10", "Likert 1-10"),
        ("boolean", "Yes/No"),
        ("text", "Open Text"),
    ]

    department = models.ForeignKey(
        "authentication.Department", on_delete=models.CASCADE, related_name="questions"
    )
    category = models.ForeignKey(
        EvaluationCategory, on_delete=models.SET_NULL, null=True, blank=True
    )
    prompt = models.TextField()
    scale_type = models.CharField(max_length=20, choices=SCALE_TYPES, default="likert_5")
    is_active = models.BooleanField(default=True)
    order_index = models.PositiveIntegerField(default=0)

    created_by = models.ForeignKey(
        "authentication.AUNUser",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_questions",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["department", "order_index", "id"]

    def __str__(self) -> str:
        return f"[{self.department.code}] {self.prompt[:60]}"


class EvaluationSession(models.Model):
    """An evaluation instance started by a student for a department using a key."""
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("submitted", "Submitted"),
        ("cancelled", "Cancelled"),
    ]

    student = models.ForeignKey(
        "authentication.AUNUser", on_delete=models.CASCADE, related_name="evaluation_sessions"
    )
    department = models.ForeignKey("authentication.Department", on_delete=models.CASCADE)
    evaluation_key = models.ForeignKey(
        "authentication.EvaluationKey", on_delete=models.PROTECT, related_name="sessions"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")

    # Pseudonymous identity for analytics and audit without exposing PII
    anonymous_identity = models.CharField(max_length=32, blank=True)

    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["department", "status"]),
        ]

    def mark_submitted(self):
        self.status = "submitted"
        self.submitted_at = timezone.now()
        self.save(update_fields=["status", "submitted_at"])


class EvaluationResponse(models.Model):
    """Stores the student's answers per question."""
    session = models.ForeignKey(
        EvaluationSession, on_delete=models.CASCADE, related_name="responses"
    )
    question = models.ForeignKey(EvaluationQuestion, on_delete=models.PROTECT)

    # Numeric score for likert; boolean stored as True/False; text for open responses
    score = models.IntegerField(null=True, blank=True)
    boolean_answer = models.BooleanField(null=True, blank=True)
    text_answer = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("session", "question")
        ordering = ["question__order_index", "question_id"]


class StaffResponse(models.Model):
    """Optional staff reply to a submitted evaluation session (not per question)."""
    session = models.OneToOneField(
        EvaluationSession, on_delete=models.CASCADE, related_name="staff_response"
    )
    responder = models.ForeignKey(
        "authentication.AUNUser", on_delete=models.SET_NULL, null=True, blank=True
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


