import { useState, useEffect } from 'react';
import {
  ClipboardCheck, TrendingUp, Users, BarChart3,
  Download, RefreshCw, Calendar, Filter
} from 'lucide-react';
import api from '../services/api';

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Period {
  id: number;
  name: string;
  is_active: boolean;
}

interface DepartmentStats {
  department_id: number;
  department_name: string;
  department_code: string;
  total_submissions: number;
  average_rating: number | null;
  total_responses: number;
  text_responses_count: number;
}

const ITSupport = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [stats, setStats] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Fetch departments and periods
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch departments
      const deptResponse = await api.get('/auth/departments/');
      if (deptResponse.data.success) {
        setDepartments(deptResponse.data.data.departments || []);
      }

      // Fetch periods
      const periodResponse = await api.get('/eval/periods/');
      if (periodResponse.data.success) {
        const periodsData = periodResponse.data.data.periods || [];
        setPeriods(periodsData);

        // Auto-select active period
        const activePeriod = periodsData.find((p: Period) => p.is_active);
        if (activePeriod) {
          setSelectedPeriod(activePeriod.id);
        }
      }
    } catch (error: any) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics for all departments
  useEffect(() => {
    if (selectedPeriod) {
      fetchAllAnalytics();
    }
  }, [selectedPeriod]);

  const fetchAllAnalytics = async () => {
    if (!selectedPeriod) return;

    try {
      setAnalyticsLoading(true);
      const statsData: DepartmentStats[] = [];

      // Fetch analytics for each department
      for (const dept of departments) {
        try {
          const response = await api.get(`/eval/department/${dept.id}/analytics/`, {
            params: { period_id: selectedPeriod }
          });

          if (response.data.success && response.data.data) {
            const analytics = response.data.data.analytics;
            statsData.push({
              department_id: dept.id,
              department_name: dept.name,
              department_code: dept.code,
              total_submissions: analytics.total_submissions || 0,
              average_rating: analytics.average_rating,
              total_responses: analytics.total_responses || 0,
              text_responses_count: analytics.text_responses_count || 0,
            });
          }
        } catch (error) {
          // Skip departments with no data
          console.log(`No analytics for ${dept.name}`);
        }
      }

      setStats(statsData);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Download CSV for a department
  const downloadDepartmentCSV = async (departmentId: number, departmentName: string) => {
    if (!selectedPeriod) return;

    try {
      const response = await api.get(`/eval/department/${departmentId}/analytics/export/`, {
        params: { period_id: selectedPeriod },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${departmentName}_analytics.csv`;
      a.click();
    } catch (error: any) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download analytics');
    }
  };

  // Filter stats by selected department
  const filteredStats = selectedDepartment
    ? stats.filter(s => s.department_id === selectedDepartment)
    : stats;

  // Calculate totals
  const totalSubmissions = filteredStats.reduce((sum, s) => sum + s.total_submissions, 0);
  const totalResponses = filteredStats.reduce((sum, s) => sum + s.total_responses, 0);
  const avgRating = filteredStats.length > 0
    ? filteredStats.reduce((sum, s) => sum + (s.average_rating || 0), 0) / filteredStats.filter(s => s.average_rating).length
    : 0;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm sm:rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                <ClipboardCheck className="w-6 h-6" />
                All Feedback & Analytics
              </h2>
              <button
                onClick={fetchAllAnalytics}
                disabled={analyticsLoading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="inline w-4 h-4 mr-2" />
                  Filter by Department
                </label>
                <select
                  value={selectedDepartment || ''}
                  onChange={(e) => setSelectedDepartment(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalSubmissions}</p>
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
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalResponses}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {avgRating > 0 ? avgRating.toFixed(2) : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Department Analytics Table */}
        <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
          {loading || analyticsLoading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          ) : filteredStats.length === 0 ? (
            <div className="p-12 text-center">
              <ClipboardCheck className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No feedback data available for the selected period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Text Responses
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStats.map((stat) => (
                    <tr key={stat.department_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{stat.department_name}</div>
                          <div className="text-xs text-gray-500">{stat.department_code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.total_submissions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.total_responses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          stat.average_rating && stat.average_rating >= 4 ? 'text-green-600' :
                          stat.average_rating && stat.average_rating >= 3 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {stat.average_rating ? stat.average_rating.toFixed(2) : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.text_responses_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => downloadDepartmentCSV(stat.department_id, stat.department_code)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900 gap-1"
                          title="Download CSV"
                        >
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ITSupport;
