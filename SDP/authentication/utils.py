import random
import string
import hashlib
from django.utils import timezone
from django.conf import settings
from .models import LoginAttempt
import secrets

def get_client_ip(request):
    """Get the client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def log_login_attempt(aun_id, ip_address, success, user_agent='', failure_reason=''):
    """Log login attempts for security monitoring"""
    LoginAttempt.objects.create(
        aun_id=aun_id,
        ip_address=ip_address,
        success=success,
        user_agent=user_agent,
        failure_reason=failure_reason
    )

def generate_evaluation_key(length=8):
    """Generate a unique evaluation key"""
    # Use a combination of letters and numbers, excluding ambiguous characters
    chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    
    while True:
        key = ''.join(secrets.choice(chars) for _ in range(length))
        # Check if key already exists
        from .models import EvaluationKey
        if not EvaluationKey.objects.filter(key=key).exists():
            return key

def hash_user_identity(user):
    """Create a consistent hash for user identity (for anonymity)"""
    identity_string = f"{user.aun_id}{user.aun_email}{timezone.now().date()}"
    return hashlib.sha256(identity_string.encode()).hexdigest()[:16]

def check_rate_limit(ip_address, max_attempts=5, time_window_minutes=15):
    """Check if IP address has exceeded login rate limit"""
    from datetime import timedelta
    
    time_threshold = timezone.now() - timedelta(minutes=time_window_minutes)
    
    recent_attempts = LoginAttempt.objects.filter(
        ip_address=ip_address,
        success=False,
        timestamp__gte=time_threshold
    ).count()
    
    return recent_attempts < max_attempts

def sanitize_user_agent(user_agent):
    """Sanitize user agent string for storage"""
    if not user_agent:
        return ''
    
    # Limit length and remove potentially harmful characters
    sanitized = user_agent[:500]
    # Remove any null bytes or other control characters
    sanitized = ''.join(char for char in sanitized if ord(char) >= 32)
    return sanitized

def generate_session_token():
    """Generate a secure session token"""
    return secrets.token_urlsafe(32)

def validate_aun_email(email):
    """Validate that email is from AUN domain"""
    return email.lower().endswith('@aun.edu.ng')

def format_aun_id(aun_id):
    """Format AUN ID consistently (A000xxx format)"""
    if aun_id:
        formatted = aun_id.upper().strip()
        # Validate format: should be A000 followed by digits
        import re
        if re.match(r'^A000\d+$', formatted):
            return formatted
        else:
            # If it doesn't match, return as is for validation to catch it
            return formatted
    return aun_id

def get_user_role_display(role):
    """Get human-readable role name"""
    role_map = {
        'student': 'Student',
        'staff': 'Staff Member',
        'department_head': 'Department Head/Manager',
        'admin': 'Administrator'
    }
    return role_map.get(role, role)

def is_strong_password(password):
    """Check if password meets security requirements"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password)
    
    if not (has_upper and has_lower and has_digit):
        return False, "Password must contain uppercase, lowercase, and numeric characters."
    
    return True, "Password is strong."

def encrypt_for_anonymity(data, user_id):
    """Simple encryption for user anonymity"""
    # This is a basic implementation - in production, use proper encryption
    key = hashlib.sha256(f"{settings.SECRET_KEY}{user_id}".encode()).digest()[:16]
    # For now, just return a hash - implement proper encryption as needed
    return hashlib.sha256(f"{data}{key.hex()}".encode()).hexdigest()[:16]

def clean_session_data(request):
    """Clean up session data on logout"""
    session_keys_to_remove = ['user_role', 'department_id', 'evaluation_context']
    for key in session_keys_to_remove:
        request.session.pop(key, None) 