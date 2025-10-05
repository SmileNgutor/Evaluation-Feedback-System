from django.urls import path
from . import views

app_name = "evaluations"

urlpatterns = [
    path("questions/", views.list_questions, name="list_questions"),
    path("start/", views.start_evaluation, name="start_evaluation"),
    path("submit/", views.submit_evaluation, name="submit_evaluation"),
    path("department/<int:department_id>/analytics/", views.department_analytics, name="department_analytics"),
    path("session/<int:session_id>/respond/", views.staff_respond, name="staff_respond"),
    path("department/<int:department_id>/sessions/", views.list_department_sessions, name="list_department_sessions"),
    path("session/<int:session_id>/", views.session_detail, name="session_detail"),
    path("department/<int:department_id>/export.csv", views.export_department_csv, name="export_department_csv"),
    path("questions/manage/", views.manage_questions, name="manage_questions"),
    path("questions/<int:question_id>/", views.question_detail, name="question_detail"),
]


