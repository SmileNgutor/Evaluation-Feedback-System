import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session-based auth
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Get CSRF token before making any requests
export const getCsrfToken = async () => {
  try {
    await api.get('/auth/dashboard/');
  } catch (error) {
    // Ignore errors, we just want the CSRF cookie
  }
};

// API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export default api;
export { API_BASE_URL };
