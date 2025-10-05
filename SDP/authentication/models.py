from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
import hashlib
import uuid

class Department(models.Model):
    """Represents academic and administrative departments at AUN"""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class AUNUserManager(BaseUserManager):
    """Custom manager for AUN User model"""
    
    def create_user(self, aun_id, aun_email, full_name, password=None, **extra_fields):
        """Create and return a regular user"""
        if not aun_id:
            raise ValueError('AUN ID is required')
        if not aun_email:
            raise ValueError('AUN email is required')
        if not full_name:
            raise ValueError('Full name is required')
        
        aun_email = self.normalize_email(aun_email)
        user = self.model(
            aun_id=aun_id,
            username=aun_id,  # Set username to aun_id to avoid conflicts
            aun_email=aun_email,
            email=aun_email,  # Set email field for Django compatibility
            full_name=full_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, aun_id, aun_email, full_name, password=None, **extra_fields):
        """Create and return a superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('role', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        
        return self.create_user(aun_id, aun_email, full_name, password, **extra_fields)

class AUNUser(AbstractUser):
    """Custom User model for AUN evaluation system"""
    
    USER_ROLES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('department_head', 'Department Head/Manager'),
        ('admin', 'Administrator'),
    ]
    
    # Override username field to make it optional and use aun_id instead
    username = models.CharField(
        max_length=150,
        unique=True,
        null=True,
        blank=True,
        help_text='Leave blank - AUN ID will be used instead'
    )
    
    # AUN specific fields
    aun_id = models.CharField(
        max_length=20, 
        unique=True,
        validators=[RegexValidator(
            regex=r'^A000\d+$',
            message='AUN ID must be in format A000xxx (e.g., A00023143)'
        )],
        help_text="AUN ID Number (e.g., 'A00023143' or 'A00023146')"
    )
    
    role = models.CharField(max_length=20, choices=USER_ROLES, default='student')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Contact information
    aun_email = models.EmailField(
        unique=True,
        help_text="Official AUN email address"
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    # Profile information
    full_name = models.CharField(max_length=200)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    
    # Academic/Professional information
    year_of_study = models.IntegerField(null=True, blank=True, help_text="For students only")
    major = models.CharField(max_length=100, blank=True, help_text="For students only")
    position = models.CharField(max_length=100, blank=True, help_text="For staff only")
    
    # Account status
    is_verified = models.BooleanField(default=False)
    verification_token = models.UUIDField(default=uuid.uuid4, editable=False)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    # Privacy settings
    allow_feedback_contact = models.BooleanField(default=True)
    anonymous_evaluations = models.BooleanField(default=True, help_text="For student evaluations")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Override email to use aun_email
    USERNAME_FIELD = 'aun_id'
    REQUIRED_FIELDS = ['aun_email', 'full_name']
    
    # Use custom manager
    objects = AUNUserManager()
    
    class Meta:
        verbose_name = 'AUN User'
        verbose_name_plural = 'AUN Users'
    
    def __str__(self):
        return f"{self.aun_id} - {self.full_name}"
    
    @property
    def is_student(self):
        return self.role == 'student'
    
    @property
    def is_staff_member(self):
        return self.role in ['staff', 'department_head']
    
    @property
    def is_department_head(self):
        return self.role == 'department_head'
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    def get_encrypted_identity(self):
        """Return consistent hashed identity for anonymous evaluations"""
        if self.anonymous_evaluations and self.is_student:
            # Create a consistent hash based on user ID and SECRET_KEY
            from django.conf import settings
            identity_string = f"{settings.SECRET_KEY}{self.aun_id}{self.id}"
            return hashlib.sha256(identity_string.encode()).hexdigest()[:16]
        return None
    
    def can_evaluate_department(self, department):
        """Check if user can evaluate a specific department"""
        if not self.is_student:
            return False
        # Students can evaluate any department they interact with
        return True
    
    def can_view_evaluations(self, department=None):
        """Check if user can view evaluations for a department"""
        if self.is_admin:
            return True
        if self.is_staff_member and department:
            return self.department == department
        return False
    
    def can_manage_evaluations(self, department=None):
        """Check if user can manage evaluations (create questions, keys, etc.)"""
        if self.is_admin:
            return True
        if self.is_department_head and department:
            return self.department == department
        return False

class UserSession(models.Model):
    """Track user sessions for security and analytics"""
    user = models.ForeignKey(AUNUser, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-login_time']
    
    def __str__(self):
        return f"{self.user.aun_id} - {self.login_time}"

class EvaluationKey(models.Model):
    """Unique keys for accessing evaluations"""
    key = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    created_by = models.ForeignKey(AUNUser, on_delete=models.CASCADE)
    
    # Key properties
    is_active = models.BooleanField(default=True)
    usage_limit = models.IntegerField(default=100, help_text="Maximum number of uses")
    usage_count = models.IntegerField(default=0)
    
    # Time constraints
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField()
    
    # Metadata
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.key} - {self.department.code}"
    
    @property
    def is_valid(self):
        now = timezone.now()
        return (
            self.is_active and 
            self.valid_from and self.valid_until and
            self.valid_from <= now <= self.valid_until and
            self.usage_count < self.usage_limit
        )
    
    def use_key(self):
        """Increment usage count when key is used"""
        if self.is_valid:
            self.usage_count += 1
            self.save()
            return True
        return False

class LoginAttempt(models.Model):
    """Track login attempts for security monitoring"""
    aun_id = models.CharField(max_length=20)
    ip_address = models.GenericIPAddressField()
    success = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user_agent = models.TextField(blank=True)
    failure_reason = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        status = "SUCCESS" if self.success else "FAILED"
        return f"{self.aun_id} - {status} - {self.timestamp}"
