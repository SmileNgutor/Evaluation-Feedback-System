from django.shortcuts import get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import transaction, models
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.openapi import OpenApiTypes
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import json
import uuid
from datetime import timedelta

from .models import AUNUser, Department, EvaluationKey, UserSession, LoginAttempt
from .forms import AUNLoginForm, UserRegistrationForm, ProfileUpdateForm
from .utils import get_client_ip, log_login_attempt, generate_evaluation_key
from .decorators import ajax_login_required, ajax_role_required

@extend_schema(
    tags=['Authentication'],
    summary='User Login',
    description='Authenticate user with AUN credentials and create session',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'aun_id': {
                    'type': 'string',
                    'description': 'AUN ID in format A000xxx',
                    'example': 'A00023143'
                },
                'password': {
                    'type': 'string',
                    'description': 'User password',
                    'example': 'securepassword123'
                }
            },
            'required': ['aun_id', 'password']
        }
    },
    responses={
        200: {
            'description': 'Login successful',
            'content': {
                'application/json': {
                    'example': {
                        'success': True,
                        'message': 'Welcome back, Student Name!',
                        'user': {
                            'id': 1,
                            'aun_id': 'A00023143',
                            'full_name': 'Student Name',
                            'aun_email': 'student.name@aun.edu.ng',
                            'role': 'student',
                            'department': {
                                'id': 1,
                                'name': 'Computer Science',
                                'code': 'CS'
                            },
                            'is_verified': True
                        }
                    }
                }
            }
        },
        401: {
            'description': 'Authentication failed',
            'content': {
                'application/json': {
                    'example': {
                        'success': False,
                        'message': 'Invalid AUN ID or password.'
                    }
                }
            }
        },
        403: {
            'description': 'Account not verified',
            'content': {
                'application/json': {
                    'example': {
                        'success': False,
                        'message': 'Your account is not verified. Please contact administration.'
                    }
                }
            }
        }
    }
)
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Handle user authentication via API"""
    try:
        data = request.data if hasattr(request, 'data') else json.loads(request.body)
        aun_id = data.get('aun_id', '').upper().strip()
        password = data.get('password', '')
        
        if not aun_id or not password:
            return Response({
                'success': False,
                'message': 'AUN ID and password are required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate user
        user = authenticate(request, username=aun_id, password=password)
        
        if user is not None:
            if user.is_verified:
                # Log successful login
                log_login_attempt(aun_id, get_client_ip(request), True, request.META.get('HTTP_USER_AGENT', ''))
                
                # Create user session record
                session_record = UserSession.objects.create(
                    user=user,
                    session_key=request.session.session_key or str(uuid.uuid4()),
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                
                # Update last login IP
                user.last_login_ip = get_client_ip(request)
                user.save(update_fields=['last_login_ip'])
                
                # Log user in
                login(request, user)
                
                # Set session data
                request.session['user_role'] = user.role
                request.session['department_id'] = user.department.id if user.department else None
                
                # Return user data
                user_data = {
                    'id': user.id,
                    'aun_id': user.aun_id,
                    'full_name': user.full_name,
                    'aun_email': user.aun_email,
                    'role': user.role,
                    'department': {
                        'id': user.department.id,
                        'name': user.department.name,
                        'code': user.department.code
                    } if user.department else None,
                    'is_verified': user.is_verified,
                    'year_of_study': user.year_of_study,
                    'major': user.major,
                    'position': user.position,
                }
                
                return Response({
                    'success': True,
                    'message': f'Welcome back, {user.full_name}!',
                    'user': user_data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': 'Your account is not verified. Please contact administration.'
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            # Log failed login
            log_login_attempt(aun_id, get_client_ip(request), False, request.META.get('HTTP_USER_AGENT', ''), 'Invalid credentials')
            return Response({
                'success': False,
                'message': 'Invalid AUN ID or password.'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except json.JSONDecodeError:
        return Response({
            'success': False,
            'message': 'Invalid JSON data.'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'success': False,
            'message': 'An error occurred during login.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@ajax_login_required
@require_http_methods(["POST"])
def logout_view(request):
    """Handle user logout via API"""
    try:
        # Update session record
        try:
            session_record = UserSession.objects.get(
                user=request.user,
                session_key=request.session.session_key,
                is_active=True
            )
            session_record.logout_time = timezone.now()
            session_record.is_active = False
            session_record.save()
        except UserSession.DoesNotExist:
            pass
        
        logout(request)
        return JsonResponse({
            'success': True,
            'message': 'You have been successfully logged out.'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'An error occurred during logout.'
        }, status=500)

@ajax_login_required
@require_http_methods(["GET"])
def dashboard(request):
    """API endpoint for dashboard data - role-based content"""
    try:
        user = request.user
        
        # Base dashboard data
        dashboard_data = {
            'user': {
                'id': user.id,
                'aun_id': user.aun_id,
                'full_name': user.full_name,
                'aun_email': user.aun_email,
                'role': user.role,
                'department': {
                    'id': user.department.id,
                    'name': user.department.name,
                    'code': user.department.code
                } if user.department else None,
                'is_verified': user.is_verified,
                'year_of_study': user.year_of_study,
                'major': user.major,
                'position': user.position,
            },
            'departments': [
                {
                    'id': dept.id,
                    'name': dept.name,
                    'code': dept.code,
                    'description': dept.description
                }
                for dept in Department.objects.filter(is_active=True)
            ]
        }
        
        if user.is_student:
            # Student dashboard data
            dashboard_data.update({
                'role_specific': {
                    'type': 'student',
                    'available_departments': dashboard_data['departments'],
                    'recent_evaluations': [],  # Filled by evaluations app
                    'evaluation_permissions': {
                        'can_evaluate': user.is_verified,
                        'anonymous_mode': user.anonymous_evaluations
                    }
                }
            })
        
        elif user.is_staff_member:
            # Staff/Department Head dashboard data
            role_data = {
                'type': 'staff' if user.role == 'staff' else 'department_head',
                'department_evaluations': [],  # TODO: Add department evaluations
                'department_analytics': {},  # TODO: Add analytics
                'permissions': {
                    'can_view_evaluations': True,
                    'can_manage_keys': user.is_department_head,
                    'can_respond_to_evaluations': True
                }
            }
            
            if user.department:
                role_data['assigned_department'] = {
                    'id': user.department.id,
                    'name': user.department.name,
                    'code': user.department.code
                }
            
            dashboard_data['role_specific'] = role_data
        
        elif user.is_admin:
            # Admin dashboard data
            dashboard_data.update({
                'role_specific': {
                    'type': 'admin',
                    'statistics': {
                        'total_users': AUNUser.objects.count(),
                        'total_departments': Department.objects.count(),
                        'verified_users': AUNUser.objects.filter(is_verified=True).count(),
                        'active_users': AUNUser.objects.filter(is_active=True).count(),
                        'failed_logins_today': LoginAttempt.objects.filter(
                            success=False,
                            timestamp__date=timezone.now().date()
                        ).count(),
                    },
                    'recent_activity': [
                        {
                            'aun_id': attempt.aun_id,
                            'success': attempt.success,
                            'timestamp': attempt.timestamp.isoformat(),
                            'ip_address': attempt.ip_address,
                        }
                        for attempt in LoginAttempt.objects.filter(success=True)[:10]
                    ],
                    'permissions': {
                        'can_manage_users': True,
                        'can_manage_departments': True,
                        'can_manage_keys': True,
                        'can_view_all_evaluations': True,
                        'can_export_data': True
                    }
                }
            })
        
        return JsonResponse({
            'success': True,
            'data': dashboard_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'An error occurred while fetching dashboard data.'
        }, status=500)

@ajax_login_required
@require_http_methods(["GET", "PUT", "PATCH"])
def profile_view(request):
    """API endpoint for user profile management"""
    try:
        if request.method == 'GET':
            # Return current profile data
            user = request.user
            recent_sessions = UserSession.objects.filter(user=user)[:5]
            
            profile_data = {
                'user': {
                    'id': user.id,
                    'aun_id': user.aun_id,
                    'full_name': user.full_name,
                    'aun_email': user.aun_email,
                    'phone_number': user.phone_number,
                    'role': user.role,
                    'department': {
                        'id': user.department.id,
                        'name': user.department.name,
                        'code': user.department.code
                    } if user.department else None,
                    'year_of_study': user.year_of_study,
                    'major': user.major,
                    'position': user.position,
                    'is_verified': user.is_verified,
                    'allow_feedback_contact': user.allow_feedback_contact,
                    'anonymous_evaluations': user.anonymous_evaluations,
                    'profile_picture': user.profile_picture.url if user.profile_picture else None,
                    'created_at': user.created_at.isoformat(),
                    'updated_at': user.updated_at.isoformat(),
                },
                'recent_sessions': [
                    {
                        'ip_address': session.ip_address,
                        'login_time': session.login_time.isoformat(),
                        'logout_time': session.logout_time.isoformat() if session.logout_time else None,
                        'is_active': session.is_active,
                    }
                    for session in recent_sessions
                ]
            }
            
            return JsonResponse({
                'success': True,
                'data': profile_data
            })
        
        elif request.method in ['PUT', 'PATCH']:
            # Update profile data
            data = json.loads(request.body)
            user = request.user
            
            # Fields that can be updated
            updatable_fields = {
                'full_name': data.get('full_name'),
                'phone_number': data.get('phone_number'),
                'allow_feedback_contact': data.get('allow_feedback_contact'),
                'anonymous_evaluations': data.get('anonymous_evaluations'),
            }
            
            # Role-specific fields
            if user.is_student:
                updatable_fields.update({
                    'year_of_study': data.get('year_of_study'),
                    'major': data.get('major'),
                })
            
            if user.is_staff_member:
                updatable_fields['position'] = data.get('position')
            
            # Update only provided fields
            updated_fields = []
            for field, value in updatable_fields.items():
                if value is not None and hasattr(user, field):
                    setattr(user, field, value)
                    updated_fields.append(field)
            
            user.save(update_fields=updated_fields + ['updated_at'])
            
            return JsonResponse({
                'success': True,
                'message': 'Profile updated successfully!',
                'updated_fields': updated_fields
            })
    
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data.'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'An error occurred while processing your request.'
        }, status=500)

@ajax_role_required(['admin', 'department_head'])
@require_http_methods(["GET", "POST"])
def manage_evaluation_keys(request):
    """API endpoint for managing evaluation keys"""
    try:
        user = request.user
        
        if request.method == 'GET':
            # Return evaluation keys data
            if user.is_admin:
                departments = Department.objects.filter(is_active=True)
                evaluation_keys = EvaluationKey.objects.all().select_related('department', 'created_by')
            else:
                departments = Department.objects.filter(id=user.department.id) if user.department else []
                evaluation_keys = EvaluationKey.objects.filter(department=user.department).select_related('department', 'created_by') if user.department else []
            
            keys_data = {
                'departments': [
                    {
                        'id': dept.id,
                        'name': dept.name,
                        'code': dept.code,
                        'description': dept.description
                    }
                    for dept in departments
                ],
                'evaluation_keys': [
                    {
                        'id': key.id,
                        'key': key.key,
                        'department': {
                            'id': key.department.id,
                            'name': key.department.name,
                            'code': key.department.code
                        },
                        'created_by': key.created_by.full_name,
                        'is_active': key.is_active,
                        'usage_count': key.usage_count,
                        'usage_limit': key.usage_limit,
                        'valid_from': key.valid_from.isoformat(),
                        'valid_until': key.valid_until.isoformat(),
                        'is_valid': key.is_valid,
                        'description': key.description,
                        'created_at': key.created_at.isoformat()
                    }
                    for key in evaluation_keys
                ],
                'user_permissions': {
                    'can_create_keys': True,
                    'can_manage_all_departments': user.is_admin,
                    'assigned_department': {
                        'id': user.department.id,
                        'name': user.department.name,
                        'code': user.department.code
                    } if user.department else None
                }
            }
            
            return JsonResponse({
                'success': True,
                'data': keys_data
            })
        
        elif request.method == 'POST':
            # Create new evaluation key
            data = json.loads(request.body)
            action = data.get('action')
            
            if action == 'create_key':
                department_id = data.get('department_id')
                description = data.get('description', '')
                usage_limit = int(data.get('usage_limit', 100))
                valid_days = int(data.get('valid_days', 30))
                
                try:
                    department = Department.objects.get(id=department_id, is_active=True)
                    
                    # Check permissions
                    if not user.is_admin and user.department != department:
                        return JsonResponse({
                            'success': False,
                            'message': 'You do not have permission to create keys for this department.'
                        }, status=403)
                    
                    # Generate new key
                    new_key = generate_evaluation_key()
                    valid_until = timezone.now() + timedelta(days=valid_days)
                    
                    eval_key = EvaluationKey.objects.create(
                        key=new_key,
                        department=department,
                        created_by=user,
                        description=description,
                        usage_limit=usage_limit,
                        valid_until=valid_until
                    )
                    
                    return JsonResponse({
                        'success': True,
                        'message': f'Evaluation key "{new_key}" created successfully!',
                        'data': {
                            'id': eval_key.id,
                            'key': eval_key.key,
                            'department': {
                                'id': department.id,
                                'name': department.name,
                                'code': department.code
                            },
                            'valid_until': eval_key.valid_until.isoformat(),
                            'usage_limit': eval_key.usage_limit
                        }
                    })
                    
                except Department.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'message': 'Invalid department selected.'
                    }, status=400)
                except ValueError as e:
                    return JsonResponse({
                        'success': False,
                        'message': 'Invalid numeric values provided.'
                    }, status=400)
            
            elif action == 'deactivate_key':
                key_id = data.get('key_id')
                try:
                    eval_key = EvaluationKey.objects.get(id=key_id)
                    
                    # Check permissions
                    if not user.is_admin and eval_key.department != user.department:
                        return JsonResponse({
                            'success': False,
                            'message': 'You do not have permission to modify this key.'
                        }, status=403)
                    
                    eval_key.is_active = False
                    eval_key.save()
                    
                    return JsonResponse({
                        'success': True,
                        'message': 'Evaluation key deactivated successfully.'
                    })
                    
                except EvaluationKey.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'message': 'Evaluation key not found.'
                    }, status=404)
                    
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid action specified.'
                }, status=400)
    
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data.'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'An error occurred while processing your request.'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def validate_evaluation_key(request):
    """AJAX endpoint to validate evaluation keys"""
    try:
        data = json.loads(request.body)
        key = data.get('key', '').strip().upper()
        department_id = data.get('department_id')
        
        if not key or not department_id:
            return JsonResponse({
                'valid': False,
                'message': 'Key and department are required.'
            })
        
        try:
            department = Department.objects.get(id=department_id, is_active=True)
            eval_key = EvaluationKey.objects.get(
                key=key,
                department=department
            )
            
            if eval_key.is_valid:
                return JsonResponse({
                    'valid': True,
                    'message': 'Valid evaluation key.',
                    'key_info': {
                        'description': eval_key.description,
                        'usage_count': eval_key.usage_count,
                        'usage_limit': eval_key.usage_limit,
                        'valid_until': eval_key.valid_until.isoformat()
                    }
                })
            else:
                reason = 'Key has expired or reached usage limit.'
                return JsonResponse({
                    'valid': False,
                    'message': reason
                })
                
        except (Department.DoesNotExist, EvaluationKey.DoesNotExist):
            return JsonResponse({
                'valid': False,
                'message': 'Invalid evaluation key for this department.'
            })
            
    except json.JSONDecodeError:
        return JsonResponse({
            'valid': False,
            'message': 'Invalid request format.'
        })
    except Exception as e:
        return JsonResponse({
            'valid': False,
            'message': 'An error occurred while validating the key.'
        })

@ajax_role_required(['admin'])
@require_http_methods(["GET", "POST", "PUT", "PATCH"])
def admin_user_management(request):
    """API endpoint for admin user management"""
    try:
        if request.method == 'GET':
            # Return users data with pagination support
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            search = request.GET.get('search', '')
            role_filter = request.GET.get('role', '')
            department_filter = request.GET.get('department', '')
            
            users_query = AUNUser.objects.all().select_related('department')
            
            # Apply filters
            if search:
                users_query = users_query.filter(
                    models.Q(aun_id__icontains=search) |
                    models.Q(full_name__icontains=search) |
                    models.Q(aun_email__icontains=search)
                )
            
            if role_filter:
                users_query = users_query.filter(role=role_filter)
            
            if department_filter:
                users_query = users_query.filter(department_id=department_filter)
            
            # Pagination
            total_users = users_query.count()
            start_index = (page - 1) * page_size
            end_index = start_index + page_size
            users = users_query[start_index:end_index]
            
            users_data = {
                'users': [
                    {
                        'id': user.id,
                        'aun_id': user.aun_id,
                        'full_name': user.full_name,
                        'aun_email': user.aun_email,
                        'role': user.role,
                        'department': {
                            'id': user.department.id,
                            'name': user.department.name,
                            'code': user.department.code
                        } if user.department else None,
                        'is_verified': user.is_verified,
                        'is_active': user.is_active,
                        'year_of_study': user.year_of_study,
                        'major': user.major,
                        'position': user.position,
                        'created_at': user.created_at.isoformat(),
                        'last_login': user.last_login.isoformat() if user.last_login else None,
                    }
                    for user in users
                ],
                'departments': [
                    {
                        'id': dept.id,
                        'name': dept.name,
                        'code': dept.code
                    }
                    for dept in Department.objects.filter(is_active=True)
                ],
                'user_roles': [
                    {'value': role[0], 'label': role[1]}
                    for role in AUNUser.USER_ROLES
                ],
                'pagination': {
                    'current_page': page,
                    'page_size': page_size,
                    'total_users': total_users,
                    'total_pages': (total_users + page_size - 1) // page_size,
                    'has_next': end_index < total_users,
                    'has_previous': page > 1
                }
            }
            
            return JsonResponse({
                'success': True,
                'data': users_data
            })
        
        elif request.method == 'POST':
            # Create new user (if needed)
            data = json.loads(request.body)
            # Implementation for creating users can be added here
            pass
        
        elif request.method in ['PUT', 'PATCH']:
            # Update user information
            data = json.loads(request.body)
            action = data.get('action')
            user_id = data.get('user_id')
            
            try:
                target_user = AUNUser.objects.get(id=user_id)
                
                if action == 'verify':
                    target_user.is_verified = True
                    target_user.save()
                    return JsonResponse({
                        'success': True,
                        'message': f'User {target_user.aun_id} has been verified.'
                    })
                
                elif action == 'deactivate':
                    target_user.is_active = False
                    target_user.save()
                    return JsonResponse({
                        'success': True,
                        'message': f'User {target_user.aun_id} has been deactivated.'
                    })
                
                elif action == 'activate':
                    target_user.is_active = True
                    target_user.save()
                    return JsonResponse({
                        'success': True,
                        'message': f'User {target_user.aun_id} has been activated.'
                    })
                
                elif action == 'change_role':
                    new_role = data.get('new_role')
                    if new_role in [role[0] for role in AUNUser.USER_ROLES]:
                        target_user.role = new_role
                        target_user.save()
                        return JsonResponse({
                            'success': True,
                            'message': f'User {target_user.aun_id} role changed to {new_role}.'
                        })
                    else:
                        return JsonResponse({
                            'success': False,
                            'message': 'Invalid role specified.'
                        }, status=400)
                
                elif action == 'change_department':
                    department_id = data.get('department_id')
                    if department_id:
                        try:
                            department = Department.objects.get(id=department_id, is_active=True)
                            target_user.department = department
                            target_user.save()
                            return JsonResponse({
                                'success': True,
                                'message': f'User {target_user.aun_id} department changed to {department.name}.'
                            })
                        except Department.DoesNotExist:
                            return JsonResponse({
                                'success': False,
                                'message': 'Invalid department specified.'
                            }, status=400)
                    else:
                        target_user.department = None
                        target_user.save()
                        return JsonResponse({
                            'success': True,
                            'message': f'User {target_user.aun_id} department removed.'
                        })
                
                else:
                    return JsonResponse({
                        'success': False,
                        'message': 'Invalid action specified.'
                    }, status=400)
                    
            except AUNUser.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'User not found.'
                }, status=404)
    
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data.'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'An error occurred while processing your request.'
        }, status=500)

@ajax_login_required
@require_http_methods(["GET"])  
def switch_role_context(request):
    """API endpoint to get user's available role contexts"""
    try:
        user = request.user
        
        # For now, users have single roles, but this can be expanded
        contexts = [{
            'role': user.role,
            'department': {
                'id': user.department.id,
                'name': user.department.name,
                'code': user.department.code
            } if user.department else None,
            'permissions': {
                'can_evaluate': user.is_student and user.is_verified,
                'can_view_evaluations': user.is_staff_member or user.is_admin,
                'can_manage_keys': user.is_department_head or user.is_admin,
                'can_manage_users': user.is_admin,
                'can_respond_to_evaluations': user.is_staff_member or user.is_admin,
            }
        }]
        
        return JsonResponse({
            'success': True,
            'data': {
                'current_role': user.role,
                'available_contexts': contexts
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'An error occurred while fetching role contexts.'
        }, status=500)

@extend_schema(
    tags=['Authentication'],
    summary='User Registration',
    description='Register a new user account. Account will be created but requires admin verification before full access.',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'aun_id': {
                    'type': 'string',
                    'description': 'AUN ID in format A000xxx',
                    'example': 'A00023143'
                },
                'aun_email': {
                    'type': 'string',
                    'format': 'email',
                    'description': 'Official AUN email address',
                    'example': 'student.name@aun.edu.ng'
                },
                'full_name': {
                    'type': 'string',
                    'description': 'Full name of the user',
                    'example': 'Student Name'
                },
                'password': {
                    'type': 'string',
                    'description': 'User password',
                    'example': 'securepassword123'
                },
                'role': {
                    'type': 'string',
                    'enum': ['student', 'staff', 'department_head', 'admin'],
                    'description': 'User role',
                    'example': 'student'
                },
                'department_id': {
                    'type': 'integer',
                    'description': 'Department ID (required for staff)',
                    'example': 1
                },
                'year_of_study': {
                    'type': 'integer',
                    'description': 'Year of study (required for students)',
                    'example': 3
                },
                'major': {
                    'type': 'string',
                    'description': 'Academic major (required for students)',
                    'example': 'Computer Science'
                },
                'position': {
                    'type': 'string',
                    'description': 'Job position (required for staff)',
                    'example': 'Assistant Professor'
                },
                'phone_number': {
                    'type': 'string',
                    'description': 'Phone number (optional)',
                    'example': '+2348012345678'
                }
            },
            'required': ['aun_id', 'aun_email', 'full_name', 'password']
        }
    },
    responses={
        201: {
            'description': 'Registration successful',
            'content': {
                'application/json': {
                    'example': {
                        'success': True,
                        'message': 'Registration successful! Your account is pending verification by administration.',
                        'user': {
                            'id': 1,
                            'aun_id': 'A00023143',
                            'full_name': 'Student Name',
                            'aun_email': 'student.name@aun.edu.ng',
                            'role': 'student',
                            'is_verified': False,
                            'verification_required': True
                        }
                    }
                }
            }
        },
        400: {
            'description': 'Validation error',
            'content': {
                'application/json': {
                    'example': {
                        'success': False,
                        'message': 'AUN ID must be in format A000xxx (e.g., A00023143).'
                    }
                }
            }
        }
    }
)
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """API endpoint for user registration"""
    try:
        data = json.loads(request.body)
        
        # Required fields
        aun_id = data.get('aun_id', '').upper().strip()
        aun_email = data.get('aun_email', '').lower().strip()
        full_name = data.get('full_name', '').strip()
        password = data.get('password', '')
        
        # Optional fields
        role = data.get('role', 'student')
        department_id = data.get('department_id')
        year_of_study = data.get('year_of_study')
        major = data.get('major', '').strip()
        position = data.get('position', '').strip()
        phone_number = data.get('phone_number', '').strip()
        
        # Validation
        if not all([aun_id, aun_email, full_name, password]):
            return JsonResponse({
                'success': False,
                'message': 'AUN ID, email, full name, and password are required.'
            }, status=400)
        
        # Validate AUN ID format
        import re
        if not re.match(r'^A000\d+$', aun_id):
            return JsonResponse({
                'success': False,
                'message': 'AUN ID must be in format A000xxx (e.g., A00023143).'
            }, status=400)
        
        # Validate AUN email domain
        if not aun_email.endswith('@aun.edu.ng'):
            return JsonResponse({
                'success': False,
                'message': 'Please use your official AUN email address (@aun.edu.ng).'
            }, status=400)
        
        # Check if user already exists
        if AUNUser.objects.filter(aun_id=aun_id).exists():
            return JsonResponse({
                'success': False,
                'message': 'This AUN ID is already registered.'
            }, status=400)
        
        if AUNUser.objects.filter(aun_email=aun_email).exists():
            return JsonResponse({
                'success': False,
                'message': 'This email address is already registered.'
            }, status=400)
        
        # Validate role
        valid_roles = [role[0] for role in AUNUser.USER_ROLES]
        if role not in valid_roles:
            return JsonResponse({
                'success': False,
                'message': 'Invalid role specified.'
            }, status=400)
        
        # Handle department for staff
        department = None
        if department_id:
            try:
                department = Department.objects.get(id=department_id, is_active=True)
            except Department.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid department specified.'
                }, status=400)
        
        # Role-specific validation
        if role == 'student':
            if not year_of_study or not major:
                return JsonResponse({
                    'success': False,
                    'message': 'Year of study and major are required for students.'
                }, status=400)
        elif role in ['staff', 'department_head']:
            if not department or not position:
                return JsonResponse({
                    'success': False,
                    'message': 'Department and position are required for staff members.'
                }, status=400)
        
        # Create user (unverified by default)
        with transaction.atomic():
            user = AUNUser.objects.create_user(
                aun_id=aun_id,
                aun_email=aun_email,
                full_name=full_name,
                password=password,
                role=role,
                department=department,
                year_of_study=year_of_study if role == 'student' else None,
                major=major if role == 'student' else '',
                position=position if role in ['staff', 'department_head'] else '',
                phone_number=phone_number,
                is_verified=False,  # Admin must verify
                is_active=True
            )
        
        return JsonResponse({
            'success': True,
            'message': 'Registration successful! Your account is pending verification by administration.',
            'user': {
                'id': user.id,
                'aun_id': user.aun_id,
                'full_name': user.full_name,
                'aun_email': user.aun_email,
                'role': user.role,
                'is_verified': user.is_verified,
                'verification_required': True
            }
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data.'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'An error occurred during registration.'
        }, status=500)

@extend_schema(
    tags=['Public'],
    summary='Get Departments List',
    description='Get list of all active departments available for registration and evaluation',
    responses={
        200: {
            'description': 'Departments retrieved successfully',
            'content': {
                'application/json': {
                    'example': {
                        'success': True,
                        'data': {
                            'departments': [
                                {
                                    'id': 1,
                                    'name': 'Computer Science',
                                    'code': 'CS',
                                    'description': 'Department of Computer Science'
                                },
                                {
                                    'id': 2,
                                    'name': 'Business Administration',
                                    'code': 'BA',
                                    'description': 'Department of Business Administration'
                                }
                            ],
                            'count': 2
                        }
                    }
                }
            }
        }
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def departments_list(request):
    """API endpoint to get list of active departments for registration"""
    try:
        departments = Department.objects.filter(is_active=True)
        departments_data = [
            {
                'id': dept.id,
                'name': dept.name,
                'code': dept.code,
                'description': dept.description
            }
            for dept in departments
        ]
        
        return Response({
            'success': True,
            'data': {
                'departments': departments_data,
                'count': len(departments_data)
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': 'An error occurred while fetching departments.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@require_http_methods(["GET"])
def api_documentation(request):
    """API endpoint documentation for frontend developers"""
    
    api_endpoints = {
        'public': {
            'departments': {
                'url': '/auth/departments/',
                'method': 'GET',
                'description': 'Get list of active departments for registration',
                'authentication': 'none',
                'response': {
                    'success': 'boolean',
                    'data': {
                        'departments': 'array - List of department objects',
                        'count': 'integer - Number of departments'
                    }
                }
            }
        },
        'authentication': {
            'register': {
                'url': '/auth/register/',
                'method': 'POST',
                'description': 'Register a new user account (requires admin verification)',
                'authentication': 'none',
                'payload': {
                    'aun_id': 'string (required) - AUN ID (e.g., A00023143)',
                    'aun_email': 'string (required) - AUN email (@aun.edu.ng)',
                    'full_name': 'string (required) - Full name',
                    'password': 'string (required) - Password',
                    'role': 'string (optional, default: student) - User role',
                    'department_id': 'integer (optional) - Department ID',
                    'year_of_study': 'integer (required for students) - Year of study',
                    'major': 'string (required for students) - Academic major',
                    'position': 'string (required for staff) - Job position',
                    'phone_number': 'string (optional) - Phone number'
                },
                'response': {
                    'success': 'boolean',
                    'message': 'string',
                    'user': {
                        'id': 'integer',
                        'aun_id': 'string',
                        'full_name': 'string',
                        'is_verified': 'boolean (false - requires admin verification)'
                    }
                }
            },
            'login': {
                'url': '/auth/login/',
                'method': 'POST',
                'description': 'Authenticate user with AUN credentials',
                'payload': {
                    'aun_id': 'string (required) - AUN ID (e.g., A00023143)',
                    'password': 'string (required) - User password'
                },
                'response': {
                    'success': 'boolean',
                    'message': 'string',
                    'user': {
                        'id': 'integer',
                        'aun_id': 'string',
                        'full_name': 'string',
                        'aun_email': 'string',
                        'role': 'string (student|staff|department_head|admin)',
                        'department': 'object or null',
                        'is_verified': 'boolean'
                    }
                }
            },
            'logout': {
                'url': '/auth/logout/',
                'method': 'POST',
                'description': 'Logout current user',
                'authentication': 'required',
                'response': {
                    'success': 'boolean',
                    'message': 'string'
                }
            }
        },
        'user_management': {
            'dashboard': {
                'url': '/auth/dashboard/',
                'method': 'GET',
                'description': 'Get role-based dashboard data',
                'authentication': 'required',
                'response': {
                    'success': 'boolean',
                    'data': {
                        'user': 'object - Current user information',
                        'departments': 'array - Available departments',
                        'role_specific': 'object - Role-based data and permissions'
                    }
                }
            },
            'profile': {
                'url': '/auth/profile/',
                'methods': ['GET', 'PUT', 'PATCH'],
                'description': 'Get or update user profile',
                'authentication': 'required',
                'get_response': {
                    'success': 'boolean',
                    'data': {
                        'user': 'object - User profile data',
                        'recent_sessions': 'array - Recent login sessions'
                    }
                },
                'update_payload': {
                    'full_name': 'string (optional)',
                    'phone_number': 'string (optional)',
                    'allow_feedback_contact': 'boolean (optional)',
                    'anonymous_evaluations': 'boolean (optional) - For students only'
                }
            }
        },
        'evaluation_keys': {
            'manage_keys': {
                'url': '/auth/manage-keys/',
                'methods': ['GET', 'POST'],
                'description': 'Manage evaluation keys (Admin/Department Head only)',
                'authentication': 'required',
                'roles': ['admin', 'department_head'],
                'create_payload': {
                    'action': 'create_key',
                    'department_id': 'integer (required)',
                    'description': 'string (optional)',
                    'usage_limit': 'integer (optional, default: 100)',
                    'valid_days': 'integer (optional, default: 30)'
                }
            },
            'validate_key': {
                'url': '/auth/validate-key/',
                'method': 'POST',
                'description': 'Validate an evaluation key for a department',
                'payload': {
                    'key': 'string (required) - Evaluation key',
                    'department_id': 'integer (required) - Department ID'
                },
                'response': {
                    'valid': 'boolean',
                    'message': 'string',
                    'key_info': 'object (if valid) - Key usage information'
                }
            }
        },
        'admin': {
            'user_management': {
                'url': '/auth/admin/users/',
                'methods': ['GET', 'PUT', 'PATCH'],
                'description': 'Manage all users (Admin only)',
                'authentication': 'required',
                'roles': ['admin'],
                'get_params': {
                    'page': 'integer (optional, default: 1)',
                    'page_size': 'integer (optional, default: 20)',
                    'search': 'string (optional) - Search by AUN ID, name, or email',
                    'role': 'string (optional) - Filter by role',
                    'department': 'string (optional) - Filter by department'
                },
                'update_actions': [
                    'verify', 'deactivate', 'activate', 
                    'change_role', 'change_department'
                ]
            }
        },
        'utility': {
            'role_context': {
                'url': '/auth/switch-role/',
                'method': 'GET',
                'description': 'Get user role context and permissions',
                'authentication': 'required',
                'response': {
                    'success': 'boolean',
                    'data': {
                        'current_role': 'string',
                        'available_contexts': 'array - Available role contexts and permissions'
                    }
                }
            }
        }
    }
    
    return JsonResponse({
        'api_name': 'AUN Evaluation System API',
        'version': '1.0',
        'description': 'RESTful API for American University of Nigeria Evaluation Platform',
        'base_url': request.build_absolute_uri('/'),
        'authentication': {
            'type': 'Session-based authentication',
            'note': 'All authenticated endpoints require login via /auth/login/ first'
        },
        'user_roles': [
            'student - Can participate in evaluations',
            'staff - Can view department evaluations and respond',
            'department_head - Can manage evaluation keys for their department',
            'admin - Full system access and user management'
        ],
        'endpoints': api_endpoints,
        'common_response_format': {
            'success': 'boolean - Indicates if request was successful',
            'message': 'string - Human-readable message',
            'data': 'object - Response data (varies by endpoint)',
            'errors': 'object - Validation errors (when applicable)'
        },
        'error_codes': {
            '400': 'Bad Request - Invalid input data',
            '401': 'Unauthorized - Authentication required',
            '403': 'Forbidden - Insufficient permissions',
            '404': 'Not Found - Resource not found',
            '500': 'Internal Server Error - Server error'
        }
    }, json_dumps_params={'indent': 2})
