import api from './api';
import type { ApiResponse } from './api';
import type { Department } from '../types';

export const departmentService = {
  /**
   * Get all departments
   */
  async getDepartments(): Promise<ApiResponse<{ departments: Department[]; count: number }>> {
    const response = await api.get<ApiResponse<{ departments: Department[]; count: number }>>('/auth/departments/');
    return response.data;
  },
};
