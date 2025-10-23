import api from './api';
import type { ApiResponse } from './api';

// Types
export interface User {
  id: number;
  aun_id: string;
  full_name: string;
  aun_email: string;
  phone_number?: string;
  role: 'student' | 'staff' | 'department_head' | 'admin';
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
  year_of_study?: number | null;
  major?: string;
  position?: string;
  is_verified: boolean;
  is_active: boolean;
  allow_feedback_contact: boolean;
  anonymous_evaluations: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
  last_login_ip?: string | null;
}

export interface UserSession {
  login_time: string;
  logout_time?: string | null;
  ip_address: string;
  is_active: boolean;
}

export interface LoginAttempt {
  timestamp: string;
  success: boolean;
  ip_address: string;
  failure_reason?: string;
}

export interface UserDetail extends User {
  recent_sessions: UserSession[];
  recent_login_attempts: LoginAttempt[];
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface BulkImportResult {
  imported: number;
  errors: number;
  error_details: Array<{
    row: number;
    data: any;
    error: string;
  }>;
}

// API Functions
class UserManagementService {
  // Get all users with optional filters
  async getUsers(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: string;
    department?: string;
  }): Promise<ApiResponse<{
    users: User[];
    departments: Department[];
    user_roles: Array<{ value: string; label: string }>;
    pagination: {
      current_page: number;
      page_size: number;
      total_users: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
  }>> {
    const response = await api.get('/auth/admin/users/', { params });
    return response.data;
  }

  // Get specific user details
  async getUserDetail(userId: number): Promise<ApiResponse<UserDetail>> {
    const response = await api.get(`/auth/admin/users/${userId}/`);
    return response.data;
  }

  // Update user
  async updateUser(userId: number, data: Partial<User>): Promise<ApiResponse> {
    const response = await api.patch(`/auth/admin/users/${userId}/update/`, data);
    return response.data;
  }

  // Deactivate user
  async deactivateUser(userId: number): Promise<ApiResponse> {
    const response = await api.post(`/auth/admin/users/${userId}/deactivate/`);
    return response.data;
  }

  // Activate user
  async activateUser(userId: number): Promise<ApiResponse> {
    const response = await api.post(`/auth/admin/users/${userId}/activate/`);
    return response.data;
  }

  // Bulk import users from CSV
  async bulkImport(file: File): Promise<ApiResponse<BulkImportResult>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/auth/admin/users/bulk-import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Get departments list
  async getDepartments(): Promise<ApiResponse<{ departments: Department[]; count: number }>> {
    const response = await api.get('/auth/departments/');
    return response.data;
  }
}

export default new UserManagementService();
