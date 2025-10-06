// User types
export interface User {
  id: number;
  aun_id: string;
  full_name: string;
  aun_email: string;
  role: 'student' | 'staff' | 'department_head' | 'admin';
  department: number | null;
  is_verified: boolean;
  year_of_study?: number;
  major?: string;
  position?: string;
  phone_number?: string;
  allow_feedback_contact?: boolean;
  anonymous_evaluations?: boolean;
}

// Department types
export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
}

// Evaluation types
export interface EvaluationKey {
  id: number;
  key: string;
  department: number;
  is_active: boolean;
  usage_limit: number;
  usage_count: number;
  valid_from: string;
  valid_until: string;
  description: string;
}

export interface EvaluationCategory {
  id: number;
  name: string;
  description: string;
}

export interface EvaluationQuestion {
  id: number;
  department: number;
  category: number | null;
  prompt: string;
  scale_type: 'likert_5' | 'likert_10' | 'boolean' | 'text';
  is_active: boolean;
  order_index: number;
}

export interface EvaluationResponse {
  question_id: number;
  score?: number;
  boolean_answer?: boolean;
  text_answer?: string;
}

export interface EvaluationSession {
  id: number;
  student: number;
  department: number;
  evaluation_key: number;
  status: 'in_progress' | 'submitted' | 'cancelled';
  anonymous_identity: string;
  started_at: string;
  submitted_at: string | null;
}

// Auth types
export interface LoginCredentials {
  aun_id: string;
  password: string;
}

export interface RegisterData {
  aun_id: string;
  aun_email: string;
  full_name: string;
  password: string;
  role?: 'student' | 'staff' | 'department_head' | 'admin';
  department_id?: number;
  year_of_study?: number;
  major?: string;
  position?: string;
  phone_number?: string;
}
