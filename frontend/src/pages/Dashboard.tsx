import { useState, useEffect } from 'react';
import {
  GraduationCap,
  UserCheck,
  BarChart2,
  Zap,
  Clock,
  BarChart,
  Users,
  Key
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { authService } from '../services/authService.ts';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await authService.getDashboard();
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (err: any) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-500">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Heading */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            {user?.role === 'student' && 'Student Dashboard'}
            {user?.role === 'staff' && 'Staff Dashboard'}
            {user?.role === 'department_head' && 'Department Head Dashboard'}
            {user?.role === 'admin' && 'Admin Dashboard'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {user?.full_name}
          </p>
        </div>
      </header>

      {error && (
        <div className="py-6">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

          {/* STUDENT DASHBOARD */}
          {user?.role === 'student' && (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <GraduationCap />
                  Student Portal
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available Departments */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <GraduationCap />
                    </div>
                    <h4 className="font-medium">Available Evaluations</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {dashboardData?.departments?.length || 0} departments available for evaluation
                  </p>
                  <a
                    href="/course-evaluation"
                    className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Key className="h-4 w-4" />
                    Start Evaluation
                  </a>
                </div>

                {/* Student Info */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                      <UserCheck />
                    </div>
                    <h4 className="font-medium">Your Information</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {user?.year_of_study && (
                      <p className="text-gray-600">Year: {user.year_of_study}</p>
                    )}
                    {user?.major && (
                      <p className="text-gray-600">Major: {user.major}</p>
                    )}
                    {user?.department && (
                      <p className="text-gray-600">Department: {dashboardData?.user?.department?.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAFF/DEPARTMENT HEAD DASHBOARD */}
          {(user?.role === 'staff' || user?.role === 'department_head') && (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <UserCheck />
                  {user.role === 'department_head' ? 'Department Head Portal' : 'Faculty Portal'}
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department Info */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                      <BarChart2 />
                    </div>
                    <h4 className="font-medium">Department Info</h4>
                  </div>
                  {dashboardData?.role_specific?.assigned_department && (
                    <div className="text-sm space-y-2">
                      <p className="text-gray-600">
                        {dashboardData.role_specific.assigned_department.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {dashboardData.role_specific.assigned_department.code}
                      </p>
                    </div>
                  )}
                  {!dashboardData?.role_specific?.assigned_department && (
                    <p className="text-sm text-gray-500">No department assigned</p>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <Zap />
                    </div>
                    <h4 className="font-medium">Quick Actions</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {dashboardData?.role_specific?.permissions?.can_view_evaluations && (
                      <a href="/course-feedback-faculty" className="block p-2 bg-gray-50 hover:bg-gray-100 rounded">
                        View Evaluations
                      </a>
                    )}
                    {dashboardData?.role_specific?.permissions?.can_manage_keys && (
                      <a href="#" className="block p-2 bg-gray-50 hover:bg-gray-100 rounded">
                        Manage Evaluation Keys
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN DASHBOARD */}
          {user?.role === 'admin' && (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <Users />
                  Admin Portal
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* System Stats */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                      <BarChart />
                    </div>
                    <h4 className="font-medium">System Stats</h4>
                  </div>
                  {dashboardData?.role_specific?.statistics && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Users</span>
                        <span className="font-medium">{dashboardData.role_specific.statistics.total_users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Departments</span>
                        <span className="font-medium">{dashboardData.role_specific.statistics.total_departments}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                      <Clock />
                    </div>
                    <h4 className="font-medium">Recent Logins</h4>
                  </div>
                  {dashboardData?.role_specific?.recent_activity && (
                    <div className="space-y-2 text-xs">
                      {dashboardData.role_specific.recent_activity.slice(0, 3).map((activity: any, index: number) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          <p className="font-medium">{activity.aun_id}</p>
                          <p className="text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin Tools */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <Zap />
                    </div>
                    <h4 className="font-medium">Admin Tools</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a href="/user-management" className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center flex flex-col items-center">
                      <UserCheck className="h-6 w-6 mb-1" />
                      <span>Users</span>
                    </a>
                    <a href="/course-feedback-faculty" className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center flex flex-col items-center">
                      <BarChart2 className="h-6 w-6 mb-1" />
                      <span>Analytics</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard; 