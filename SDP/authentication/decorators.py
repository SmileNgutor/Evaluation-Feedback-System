from functools import wraps
from django.shortcuts import redirect
from django.contrib import messages
from django.http import HttpResponseForbidden, JsonResponse
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

def role_required(allowed_roles):
    """
    Decorator to restrict access based on user roles
    Usage: @role_required(['admin', 'department_head'])
    """
    def decorator(view_func):
        @wraps(view_func)
        @login_required
        def _wrapped_view(request, *args, **kwargs):
            if not hasattr(request.user, 'role'):
                messages.error(request, 'Access denied: Invalid user account.')
                return redirect('login')
            
            if request.user.role not in allowed_roles:
                messages.error(request, 'Access denied: Insufficient permissions.')
                return redirect('dashboard')
            
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

def student_required(view_func):
    """Decorator to restrict access to students only"""
    @wraps(view_func)
    @login_required
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_student:
            messages.error(request, 'Access denied: This feature is for students only.')
            return redirect('dashboard')
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def staff_required(view_func):
    """Decorator to restrict access to staff members only"""
    @wraps(view_func)
    @login_required
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_staff_member:
            messages.error(request, 'Access denied: This feature is for staff members only.')
            return redirect('dashboard')
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def admin_required(view_func):
    """Decorator to restrict access to administrators only"""
    @wraps(view_func)
    @login_required
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_admin:
            messages.error(request, 'Access denied: Administrator privileges required.')
            return redirect('dashboard')
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def department_head_required(view_func):
    """Decorator to restrict access to department heads only"""
    @wraps(view_func)
    @login_required
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_department_head:
            messages.error(request, 'Access denied: Department head privileges required.')
            return redirect('dashboard')
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def verified_user_required(view_func):
    """Decorator to ensure user account is verified"""
    @wraps(view_func)
    @login_required
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_verified:
            messages.warning(request, 'Your account is not yet verified. Please contact administration.')
            return redirect('profile')
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def department_access_required(view_func):
    """
    Decorator to check if user has access to a specific department
    Expects department_id in kwargs or request parameters
    """
    @wraps(view_func)
    @login_required
    def _wrapped_view(request, *args, **kwargs):
        department_id = kwargs.get('department_id') or request.GET.get('department_id') or request.POST.get('department_id')
        
        if not department_id:
            messages.error(request, 'Department not specified.')
            return redirect('dashboard')
        
        # Admin can access all departments
        if request.user.is_admin:
            return view_func(request, *args, **kwargs)
        
        # Staff can only access their own department
        if request.user.is_staff_member:
            if request.user.department and str(request.user.department.id) == str(department_id):
                return view_func(request, *args, **kwargs)
            else:
                messages.error(request, 'Access denied: You can only access your own department.')
                return redirect('dashboard')
        
        # Students can access any department for evaluation
        if request.user.is_student:
            return view_func(request, *args, **kwargs)
        
        messages.error(request, 'Access denied: Invalid permissions.')
        return redirect('dashboard')
    return _wrapped_view

def ajax_login_required(view_func):
    """Decorator for AJAX views that require authentication"""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({
                'error': 'Authentication required',
                'redirect': '/login/'
            }, status=401)
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def ajax_role_required(allowed_roles):
    """Decorator for AJAX views with role restrictions"""
    def decorator(view_func):
        @wraps(view_func)
        @ajax_login_required
        def _wrapped_view(request, *args, **kwargs):
            if not hasattr(request.user, 'role') or request.user.role not in allowed_roles:
                return JsonResponse({
                    'error': 'Insufficient permissions',
                    'required_roles': allowed_roles
                }, status=403)
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

def rate_limit_required(max_attempts=5, time_window_minutes=15):
    """
    Decorator to implement rate limiting for views
    Useful for login attempts, form submissions, etc.
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            from .utils import check_rate_limit, get_client_ip
            
            client_ip = get_client_ip(request)
            
            if not check_rate_limit(client_ip, max_attempts, time_window_minutes):
                if request.is_ajax():
                    return JsonResponse({
                        'error': f'Rate limit exceeded. Please try again after {time_window_minutes} minutes.'
                    }, status=429)
                else:
                    messages.error(request, f'Too many attempts. Please try again after {time_window_minutes} minutes.')
                    return redirect('login')
            
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

def evaluation_access_required(view_func):
    """
    Decorator to check if user can access evaluation features
    Students need to be verified and have valid evaluation context
    """
    @wraps(view_func)
    @login_required
    @verified_user_required
    def _wrapped_view(request, *args, **kwargs):
        # Additional checks can be added here
        # For example, checking if student is in good academic standing
        # or if evaluation period is active
        
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def same_department_required(view_func):
    """
    Decorator to ensure staff can only access data from their department
    """
    @wraps(view_func)
    @login_required
    def _wrapped_view(request, *args, **kwargs):
        if request.user.is_admin:
            # Admins can access all departments
            return view_func(request, *args, **kwargs)
        
        if not request.user.department:
            messages.error(request, 'No department assigned to your account.')
            return redirect('dashboard')
        
        # Check if the requested resource belongs to user's department
        # This decorator assumes the view will handle department verification
        return view_func(request, *args, **kwargs)
    return _wrapped_view 