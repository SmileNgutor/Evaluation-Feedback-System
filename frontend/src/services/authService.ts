import api from './api.ts';
import type { ApiResponse } from './api.ts';
import type { User, LoginCredentials, RegisterData } from '../types';

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post('/auth/login/', credentials);
    // Backend returns { success: true, message: "...", user: {...} }
    // Transform to match expected format
    if (response.data.success && response.data.user) {
      return {
        success: true,
        data: {
          user: response.data.user
        }
      };
    }
    return response.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/register/', data);
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/logout/');
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get('/auth/profile/');
    // Backend returns { success: true, data: { user: {...} } }
    // Extract the user from the nested structure
    if (response.data.success && response.data.data && response.data.data.user) {
      return {
        success: true,
        data: response.data.data.user
      };
    }
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<ApiResponse> {
    const response = await api.patch<ApiResponse>('/auth/profile/', data);
    return response.data;
  },

  /**
   * Get dashboard data (role-based)
   */
  async getDashboard(): Promise<ApiResponse> {
    const response = await api.get<ApiResponse>('/auth/dashboard/');
    return response.data;
  },
};
