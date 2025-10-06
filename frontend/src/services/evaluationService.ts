import api from './api';
import type { ApiResponse } from './api';
import type { EvaluationQuestion, EvaluationResponse } from '../types';

export const evaluationService = {
  /**
   * Get questions for a department
   */
  async getQuestions(departmentId: number, categoryId?: number): Promise<ApiResponse<{ questions: EvaluationQuestion[]; count: number }>> {
    const params: any = { department_id: departmentId };
    if (categoryId) {
      params.category_id = categoryId;
    }
    const response = await api.get<ApiResponse<{ questions: EvaluationQuestion[]; count: number }>>('/evaluations/questions/', { params });
    return response.data;
  },

  /**
   * Start an evaluation session
   */
  async startEvaluation(departmentId: number, key: string): Promise<ApiResponse<{ session_id: number }>> {
    const response = await api.post<ApiResponse<{ session_id: number }>>('/evaluations/start/', {
      department_id: departmentId,
      key: key,
    });
    return response.data;
  },

  /**
   * Submit evaluation responses
   */
  async submitEvaluation(sessionId: number, responses: EvaluationResponse[]): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/evaluations/submit/', {
      session_id: sessionId,
      responses: responses,
    });
    return response.data;
  },

  /**
   * Get department analytics (staff/admin only)
   */
  async getDepartmentAnalytics(departmentId: number): Promise<ApiResponse> {
    const response = await api.get<ApiResponse>(`/evaluations/analytics/${departmentId}/`);
    return response.data;
  },

  /**
   * Get department sessions (staff/admin only)
   */
  async getDepartmentSessions(departmentId: number): Promise<ApiResponse> {
    const response = await api.get<ApiResponse>(`/evaluations/sessions/${departmentId}/`);
    return response.data;
  },

  /**
   * Get session detail (staff/admin only)
   */
  async getSessionDetail(sessionId: number): Promise<ApiResponse> {
    const response = await api.get<ApiResponse>(`/evaluations/session/${sessionId}/`);
    return response.data;
  },

  /**
   * Submit staff response to evaluation
   */
  async submitStaffResponse(sessionId: number, message: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`/evaluations/staff-respond/${sessionId}/`, {
      message: message,
    });
    return response.data;
  },
};
