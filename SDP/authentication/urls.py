from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # API Documentation
    path('api/docs/', views.api_documentation, name='api_documentation'),
    
    # Public endpoints
    path('departments/', views.departments_list, name='departments_list'),
    
    # Authentication URLs
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('profile/', views.profile_view, name='profile'),
    
    # Evaluation Key Management
    path('manage-keys/', views.manage_evaluation_keys, name='manage_evaluation_keys'),
    path('validate-key/', views.validate_evaluation_key, name='validate_evaluation_key'),
    
    # Admin Views
    path('admin/users/', views.admin_user_management, name='admin_user_management'),
    
    # Role switching (if needed)
    path('switch-role/', views.switch_role_context, name='switch_role_context'),
] 