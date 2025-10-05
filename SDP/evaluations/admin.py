from django.contrib import admin
from .models import (
    EvaluationCategory,
    EvaluationQuestion,
    EvaluationSession,
    EvaluationResponse,
    StaffResponse,
)


@admin.register(EvaluationCategory)
class EvaluationCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "is_active", "created_at"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["name", "description"]


@admin.register(EvaluationQuestion)
class EvaluationQuestionAdmin(admin.ModelAdmin):
    list_display = [
        "department",
        "category",
        "order_index",
        "scale_type",
        "is_active",
        "short_prompt",
        "created_at",
    ]
    list_filter = ["department", "category", "is_active", "scale_type", "created_at"]
    search_fields = ["prompt", "department__name", "department__code"]
    ordering = ["department", "order_index", "id"]

    def short_prompt(self, obj):
        return (obj.prompt or "")[:60]
    short_prompt.short_description = "Prompt"


class EvaluationResponseInline(admin.TabularInline):
    model = EvaluationResponse
    extra = 0
    readonly_fields = ["question", "score", "boolean_answer", "text_answer", "created_at"]


@admin.register(EvaluationSession)
class EvaluationSessionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "student",
        "department",
        "status",
        "started_at",
        "submitted_at",
        "anonymous_identity",
    ]
    list_filter = ["department", "status", "started_at", "submitted_at"]
    search_fields = [
        "student__aun_id",
        "student__full_name",
        "department__name",
        "department__code",
        "anonymous_identity",
    ]
    readonly_fields = ["started_at", "submitted_at"]
    inlines = [EvaluationResponseInline]


@admin.register(StaffResponse)
class StaffResponseAdmin(admin.ModelAdmin):
    list_display = ["session", "responder", "created_at", "short_message"]
    list_filter = ["created_at"]
    search_fields = ["responder__full_name", "message"]

    def short_message(self, obj):
        return (obj.message or "")[:80]
    short_message.short_description = "Message"


