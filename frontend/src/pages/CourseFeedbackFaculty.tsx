import { useState, useEffect } from 'react';
import {
  BarChart2, TrendingUp, Users, MessageSquare,
  Download, RefreshCw, Calendar, Eye, Filter
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Period {
  id: number;
  name: string;
  is_active: boolean;
}

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Analytics {
  total_submissions: number;
  total_responses: number;
  average_rating: number | null;
  text_responses_count: number;
  question_averages: Record<string, any>;
  category_averages: Record<string, number>;
  common_keywords: Array<{ word: string; count: number }>;
}

interface DepartmentResponse {
  id: number;
  title: string;
  message: string;
  is_published: boolean;
  created_at: string;
  author: {
    full_name: string;
  };
}

const CourseFeedbackFaculty = () => {
  const { user } = useAuth();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [responses, setResponses] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<DepartmentResponse | null>(null);

  const isAdmin = user?.role === 'admin';

  // Fetch initial data
  useEffect(() => {
    fetchPeriods();
    if (isAdmin) {
      fetchDepartments();
    } else if (user?.department) {
      setSelectedDepartment(user.department);
    }
  }, [user, isAdmin]);

  // Fetch analytics when period or department changes
  useEffect(() => {
    if (selectedPeriod && selectedDepartment) {
      fetchAnalytics();
      fetchResponses();
    }
  }, [selectedPeriod, selectedDepartment]);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const response = await api.get('/eval/periods/');
      if (response.data.success) {
        const periodsData = response.data.data.periods || [];
        setPeriods(periodsData);

        // Auto-select active period
        const activePeriod = periodsData.find((p: Period) => p.is_active);
        if (activePeriod) {
          setSelectedPeriod(activePeriod.id);
        }
      }
    } catch (error: any) {
      console.error('Error fetching periods:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/auth/departments/');
      if (response.data.success) {
        const depts = response.data.data.departments || [];
        setDepartments(depts);
        // Auto-select first department for admins
        if (depts.length > 0) {
          setSelectedDepartment(depts[0].id);
        }
      }
    } catch (error: any) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedDepartment || !selectedPeriod) return;

    try {
      setAnalyticsLoading(true);
      const response = await api.get(`/eval/department/${selectedDepartment}/analytics/`, {
        params: { period_id: selectedPeriod }
      });

      if (response.data.success && response.data.data) {
        setAnalytics(response.data.data.metrics || response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      setAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchResponses = async () => {
    if (!selectedDepartment || !selectedPeriod) return;

    try {
      const response = await api.get(`/eval/department/${selectedDepartment}/responses/`, {
        params: { period_id: selectedPeriod }
      });

      if (response.data.success && response.data.data) {
        setResponses(response.data.data.responses || []);
      }
    } catch (error: any) {
      console.error('Error fetching responses:', error);
    }
  };

  const downloadCSV = async () => {
    if (!selectedDepartment || !selectedPeriod) return;

    try {
      const response = await api.get(`/eval/department/${selectedDepartment}/analytics/export/`, {
        params: { period_id: selectedPeriod },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `department_analytics_${selectedPeriod}.csv`;
      a.click();
    } catch (error: any) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download analytics');
    }
  };

  const viewResponse = (response: DepartmentResponse) => {
    setSelectedResponse(response);
    setShowResponseModal(true);
  };

  // Only show "not assigned" error for non-admin users
  if (!isAdmin && !user?.department) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-12 text-center">
            <BarChart2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">You are not assigned to a department.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm sm:rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                  <BarChart2 className="w-6 h-6" />
                  Course Feedback - {isAdmin ? 'Admin' : 'Faculty'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {isAdmin && selectedDepartment
                    ? `${departments.find(d => d.id === selectedDepartment)?.name || 'Department'} Analytics & Student Feedback`
                    : 'Department Analytics & Student Feedback'
                  }
                </p>
              </div>
              <button
                onClick={downloadCSV}
                disabled={!analytics}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Selectors */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department Selector (Admins only) */}
              {isAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Filter className="inline w-4 h-4 mr-2" />
                    Department
                  </label>
                  <select
                    value={selectedDepartment || ''}
                    onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Period Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Evaluation Period
                </label>
                <select
                  value={selectedPeriod || ''}
                  onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Period</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name} {period.is_active ? '(Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading || analyticsLoading ? (
          <div className="bg-white shadow-sm sm:rounded-lg p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : !analytics ? (
          <div className="bg-white shadow-sm sm:rounded-lg p-12 text-center">
            <BarChart2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No feedback data available for this period</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white shadow-sm sm:rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Submissions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.total_submissions}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm sm:rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Responses</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.total_responses}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <BarChart2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm sm:rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {analytics.average_rating ? analytics.average_rating.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm sm:rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Text Feedback</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.text_responses_count}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Averages */}
            {Object.keys(analytics.category_averages).length > 0 && (
              <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Category Averages</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(analytics.category_averages).map(([category, average]) => (
                      <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className={`text-lg font-bold ${
                          average >= 4 ? 'text-green-600' :
                          average >= 3 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {average.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Common Keywords */}
            {analytics.common_keywords && analytics.common_keywords.length > 0 && (
              <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Common Keywords from Text Feedback</h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {analytics.common_keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {keyword.word} ({keyword.count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Department Responses */}
            <div className="bg-white shadow-sm sm:rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Department Responses to Feedback</h3>
              </div>
              <div className="p-6">
                {responses.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No responses posted yet</p>
                ) : (
                  <div className="space-y-4">
                    {responses.map((response) => (
                      <div
                        key={response.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => viewResponse(response)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{response.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{response.message}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500">
                                By {response.author?.full_name || 'Anonymous'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(response.created_at).toLocaleDateString()}
                              </span>
                              {response.is_published && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Published
                                </span>
                              )}
                            </div>
                          </div>
                          <Eye className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Response Detail Modal */}
      {showResponseModal && selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedResponse.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(selectedResponse.created_at).toLocaleDateString()} •{' '}
                    {selectedResponse.author?.full_name || 'Anonymous'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedResponse(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedResponse.message}</p>
              </div>

              {selectedResponse.is_published && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm text-green-800">
                    This response has been published and is visible to students.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedResponse(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseFeedbackFaculty;
