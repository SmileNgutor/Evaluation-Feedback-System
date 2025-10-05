from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from .models import AUNUser, Department

class AUNLoginForm(forms.Form):
    """Custom login form for AUN users"""
    aun_id = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your AUN ID (e.g., A00023143)',
            'autofocus': True
        }),
        label='AUN ID'
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your password'
        }),
        label='Password'
    )
    remember_me = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        }),
        label='Remember me'
    )

    def clean_aun_id(self):
        aun_id = self.cleaned_data.get('aun_id')
        if aun_id:
            aun_id = aun_id.upper().strip()
        return aun_id

    def clean(self):
        cleaned_data = super().clean()
        aun_id = cleaned_data.get('aun_id')
        password = cleaned_data.get('password')

        if aun_id and password:
            # Check if user exists
            try:
                user = AUNUser.objects.get(aun_id=aun_id)
                if not user.is_active:
                    raise ValidationError("This account has been deactivated.")
            except AUNUser.DoesNotExist:
                raise ValidationError("Invalid AUN ID or password.")

        return cleaned_data

class UserRegistrationForm(UserCreationForm):
    """Registration form for new AUN users"""
    
    aun_id = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'AUN ID (e.g., A00023143)'
        }),
        help_text='Your official AUN ID number'
    )
    
    aun_email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'your.name@aun.edu.ng'
        }),
        help_text='Your official AUN email address'
    )
    
    full_name = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Your full name'
        })
    )
    
    role = forms.ChoiceField(
        choices=AUNUser.USER_ROLES,
        widget=forms.Select(attrs={
            'class': 'form-control'
        }),
        initial='student'
    )
    
    department = forms.ModelChoiceField(
        queryset=Department.objects.filter(is_active=True),
        widget=forms.Select(attrs={
            'class': 'form-control'
        }),
        required=False,
        help_text='Select your department (optional for students)'
    )
    
    year_of_study = forms.IntegerField(
        min_value=1,
        max_value=6,
        required=False,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g., 3'
        }),
        help_text='For students only: current year of study'
    )
    
    major = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g., Computer Science'
        }),
        help_text='For students only: your major/program'
    )
    
    position = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g., Assistant Professor'
        }),
        help_text='For staff only: your position/title'
    )

    class Meta:
        model = AUNUser
        fields = ('aun_id', 'aun_email', 'full_name', 'role', 'department', 
                 'year_of_study', 'major', 'position', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add CSS classes to password fields
        self.fields['password1'].widget.attrs.update({'class': 'form-control'})
        self.fields['password2'].widget.attrs.update({'class': 'form-control'})

    def clean_aun_id(self):
        aun_id = self.cleaned_data.get('aun_id')
        if aun_id:
            aun_id = aun_id.upper().strip()
            # Check if AUN ID already exists
            if AUNUser.objects.filter(aun_id=aun_id).exists():
                raise ValidationError("This AUN ID is already registered.")
        return aun_id

    def clean_aun_email(self):
        aun_email = self.cleaned_data.get('aun_email')
        if aun_email:
            # Check if email is from AUN domain
            if not aun_email.endswith('@aun.edu.ng'):
                raise ValidationError("Please use your official AUN email address (@aun.edu.ng)")
            
            # Check if email already exists
            if AUNUser.objects.filter(aun_email=aun_email).exists():
                raise ValidationError("This email address is already registered.")
        return aun_email

    def clean(self):
        cleaned_data = super().clean()
        role = cleaned_data.get('role')
        department = cleaned_data.get('department')
        year_of_study = cleaned_data.get('year_of_study')
        major = cleaned_data.get('major')
        position = cleaned_data.get('position')

        # Validation based on role
        if role == 'student':
            if not year_of_study:
                self.add_error('year_of_study', 'Year of study is required for students.')
            if not major:
                self.add_error('major', 'Major/program is required for students.')
        
        elif role in ['staff', 'department_head']:
            if not department:
                self.add_error('department', 'Department is required for staff members.')
            if not position:
                self.add_error('position', 'Position/title is required for staff members.')

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        # Set the email field to aun_email for Django's auth system
        user.email = self.cleaned_data['aun_email']
        if commit:
            user.save()
        return user

class ProfileUpdateForm(forms.ModelForm):
    """Form for updating user profiles"""
    
    class Meta:
        model = AUNUser
        fields = [
            'full_name', 'aun_email', 'phone_number', 'profile_picture',
            'year_of_study', 'major', 'position', 'allow_feedback_contact',
            'anonymous_evaluations'
        ]
        widgets = {
            'full_name': forms.TextInput(attrs={'class': 'form-control'}),
            'aun_email': forms.EmailInput(attrs={'class': 'form-control'}),
            'phone_number': forms.TextInput(attrs={'class': 'form-control'}),
            'profile_picture': forms.FileInput(attrs={'class': 'form-control'}),
            'year_of_study': forms.NumberInput(attrs={'class': 'form-control'}),
            'major': forms.TextInput(attrs={'class': 'form-control'}),
            'position': forms.TextInput(attrs={'class': 'form-control'}),
            'allow_feedback_contact': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'anonymous_evaluations': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = kwargs.get('instance')
        
        if user:
            # Hide irrelevant fields based on user role
            if not user.is_student:
                self.fields.pop('year_of_study', None)
                self.fields.pop('major', None)
                self.fields.pop('anonymous_evaluations', None)
            
            if not user.is_staff_member:
                self.fields.pop('position', None)

    def clean_aun_email(self):
        aun_email = self.cleaned_data.get('aun_email')
        if aun_email:
            # Check if email is from AUN domain
            if not aun_email.endswith('@aun.edu.ng'):
                raise ValidationError("Please use your official AUN email address (@aun.edu.ng)")
            
            # Check if email already exists (excluding current user)
            user = self.instance
            if AUNUser.objects.filter(aun_email=aun_email).exclude(id=user.id).exists():
                raise ValidationError("This email address is already in use.")
        return aun_email

class EvaluationKeyForm(forms.Form):
    """Form for entering evaluation keys"""
    
    evaluation_key = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter evaluation key',
            'style': 'text-transform: uppercase;'
        }),
        label='Evaluation Key'
    )
    
    department = forms.ModelChoiceField(
        queryset=Department.objects.filter(is_active=True),
        widget=forms.Select(attrs={
            'class': 'form-control'
        }),
        label='Department to Evaluate'
    )

    def clean_evaluation_key(self):
        key = self.cleaned_data.get('evaluation_key')
        if key:
            key = key.upper().strip()
        return key

class DepartmentForm(forms.ModelForm):
    """Form for managing departments (Admin only)"""
    
    class Meta:
        model = Department
        fields = ['name', 'code', 'description', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'code': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

    def clean_code(self):
        code = self.cleaned_data.get('code')
        if code:
            code = code.upper().strip()
        return code 