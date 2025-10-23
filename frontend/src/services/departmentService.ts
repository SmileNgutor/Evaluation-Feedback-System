import api from './api.ts';
import type { ApiResponse } from './api.ts';
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
