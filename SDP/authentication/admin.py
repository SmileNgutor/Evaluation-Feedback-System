from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import AUNUser, Department, EvaluationKey, UserSession, LoginAttempt

@admin.register(AUNUser)
class AUNUserAdmin(UserAdmin):
    """Custom admin for AUN Users"""
    
    list_display = [
        'aun_id', 'full_name', 'aun_email', 'role', 'department', 
        'is_verified', 'is_active', 'created_at'
    ]
    list_filter = [
        'role', 'department', 'is_verified', 'is_active', 
        'created_at', 'year_of_study'
    ]
    search_fields = ['aun_id', 'full_name', 'aun_email']
    ordering = ['-created_at']
    
    # Fieldsets for the edit form
    fieldsets = (
        ('AUN Information', {
            'fields': ('aun_id', 'aun_email', 'full_name', 'role', 'department')
        }),
        ('Academic/Professional Info', {
            'fields': ('year_of_study', 'major', 'position'),
            'classes': ('collapse',)
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'profile_picture'),
            'classes': ('collapse',)
        }),
        ('Account Status', {
            'fields': ('is_verified', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Privacy Settings', {
            'fields': ('allow_feedback_contact', 'anonymous_evaluations'),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('last_login', 'last_login_ip', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Groups & Permissions', {
            'fields': ('groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
    )
    
    # Fields for the add form
    add_fieldsets = (
        ('Required Information', {
            'fields': ('aun_id', 'aun_email', 'full_name', 'password1', 'password2')
        }),
        ('Role & Department', {
            'fields': ('role', 'department')
        }),
        ('Additional Information', {
            'fields': ('year_of_study', 'major', 'position'),
            'classes': ('collapse',)
        }),
    )
    
    # Hide username field in admin since we use aun_id
    exclude = ['username']
    
    readonly_fields = ['created_at', 'updated_at', 'last_login', 'last_login_ip']
    
    # Custom actions
    actions = ['verify_users', 'deactivate_users', 'activate_users']
    
    def verify_users(self, request, queryset):
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} users have been verified.')
    verify_users.short_description = "Mark selected users as verified"
    
    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} users have been deactivated.')
    deactivate_users.short_description = "Deactivate selected users"
    
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} users have been activated.')
    activate_users.short_description = "Activate selected users"

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    """Admin for Departments"""
    
    list_display = ['code', 'name', 'is_active', 'user_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'code', 'description']
    ordering = ['name']
    
    readonly_fields = ['created_at']
    
    def user_count(self, obj):
        count = obj.aunuser_set.count()
        url = reverse('admin:authentication_aunuser_changelist') + f'?department__id__exact={obj.id}'
        return format_html('<a href="{}">{} users</a>', url, count)
    user_count.short_description = 'Users'

@admin.register(EvaluationKey)
class EvaluationKeyAdmin(admin.ModelAdmin):
    """Admin for Evaluation Keys"""
    
    list_display = [
        'key', 'department', 'created_by', 'is_active', 
        'usage_count', 'usage_limit', 'valid_until', 'is_valid_status'
    ]
    list_filter = [
        'department', 'is_active', 'created_at', 'valid_until'
    ]
    search_fields = ['key', 'description', 'department__name', 'created_by__full_name']
    ordering = ['-created_at']
    
    readonly_fields = ['created_at', 'usage_count', 'is_valid_status']
    
    def is_valid_status(self, obj):
        # Handle unsaved objects or objects without required fields
        if not obj.pk or not obj.valid_from or not obj.valid_until:
            return format_html('<span style="color: gray;">— Pending</span>')
        elif obj.is_valid:
            return format_html('<span style="color: green;">✓ Valid</span>')
        else:
            return format_html('<span style="color: red;">✗ Invalid</span>')
    is_valid_status.short_description = 'Status'
    
    # Custom actions
    actions = ['deactivate_keys', 'activate_keys']
    
    def deactivate_keys(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} evaluation keys have been deactivated.')
    deactivate_keys.short_description = "Deactivate selected keys"
    
    def activate_keys(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} evaluation keys have been activated.')
    activate_keys.short_description = "Activate selected keys"

@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """Admin for User Sessions"""
    
    list_display = [
        'user', 'ip_address', 'login_time', 'logout_time', 
        'is_active', 'session_duration'
    ]
    list_filter = ['is_active', 'login_time', 'logout_time']
    search_fields = ['user__aun_id', 'user__full_name', 'ip_address']
    ordering = ['-login_time']
    
    readonly_fields = ['session_duration', 'login_time', 'logout_time']
    
    def session_duration(self, obj):
        if obj.logout_time:
            duration = obj.logout_time - obj.login_time
            return str(duration).split('.')[0]  # Remove microseconds
        elif obj.is_active:
            return "Active session"
        return "Unknown"
    session_duration.short_description = 'Duration'

@admin.register(LoginAttempt)
class LoginAttemptAdmin(admin.ModelAdmin):
    """Admin for Login Attempts"""
    
    list_display = [
        'aun_id', 'ip_address', 'success', 'timestamp', 
        'failure_reason', 'user_agent_short'
    ]
    list_filter = ['success', 'timestamp', 'failure_reason']
    search_fields = ['aun_id', 'ip_address', 'failure_reason']
    ordering = ['-timestamp']
    
    readonly_fields = ['timestamp']
    
    def user_agent_short(self, obj):
        if obj.user_agent:
            return obj.user_agent[:50] + ('...' if len(obj.user_agent) > 50 else '')
        return 'N/A'
    user_agent_short.short_description = 'User Agent'
    
    # Custom actions for security monitoring
    actions = ['analyze_failed_attempts']
    
    def analyze_failed_attempts(self, request, queryset):
        failed_attempts = queryset.filter(success=False)
        ip_counts = {}
        for attempt in failed_attempts:
            ip_counts[attempt.ip_address] = ip_counts.get(attempt.ip_address, 0) + 1
        
        message = "Failed attempt analysis: "
        for ip, count in sorted(ip_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
            message += f"{ip}: {count} attempts; "
        
        self.message_user(request, message)
    analyze_failed_attempts.short_description = "Analyze failed login attempts"

# Customize admin site
admin.site.site_header = "AUN Evaluation System Administration"
admin.site.site_title = "AUN Evaluation Admin"
admin.site.index_title = "Welcome to AUN Evaluation System Administration"
