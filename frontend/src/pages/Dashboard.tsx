import { 
  GraduationCap, 
  AlertCircle, 
  WifiOff, 
  Check, 
  UserCheck, 
  BarChart2, 
  AlertTriangle, 
  Zap, 
  Cpu, 
  Wrench, 
  Flag, 
  Clock, 
  BarChart, 
  ListChecks, 
  Star,
  Users
} from 'lucide-react';

const Dashboard = () => {
  return (
    <>
      {/* Page Heading */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            System Dashboard
          </h2>
        </div>
      </header>

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

          {/* STUDENT SECTION */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <GraduationCap />
                Student Portal
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Maintenance Status */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <AlertCircle />
                  </div>
                  <h4 className="font-medium">Current Issues</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5"><WifiOff /></span>
                    <span>WiFi issues in Building A</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <span className="mt-0.5"><Check /></span>
                    <span>Projector in Room 302 fixed</span>
                  </li>
                </ul>
              </div>

              {/* Recent Activity */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                    <Clock />
                  </div>
                  <h4 className="font-medium">Your Recent Activity</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>IT Ticket #4521 (Assigned)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>Course Evaluation submitted</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FACULTY SECTION */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <UserCheck />
                Faculty Portal
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Course Feedback */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <BarChart2 />
                  </div>
                  <h4 className="font-medium">Course Feedback</h4>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">CS-101: 4.2/5 (32 evaluations)</p>
                  <p className="text-gray-600 mt-1">MATH-202: 3.8/5 (28 evaluations)</p>
                </div>
              </div>

              {/* Open Issues */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                    <AlertTriangle />
                  </div>
                  <h4 className="font-medium">Classroom Issues</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">•</span>
                    <span>Broken chair in Room 415</span>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Zap />
                  </div>
                  <h4 className="font-medium">Quick Actions</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/faculty/it-support" className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                    <Cpu className="mx-auto" />
                    IT Help
                  </a>
                  <a href="/faculty/maintenance" className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                    <Wrench className="mx-auto" />
                    Maintenance
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ADMIN SECTION */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <Users />
                Admin Portal
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Reported Issues */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-100 rounded-full text-red-600">
                    <Flag />
                  </div>
                  <h4 className="font-medium">Reported Issues</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 bg-red-50 rounded">
                    <div className="flex-none pt-0.5 text-red-500">
                      <AlertCircle />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Server Down</p>
                      <p className="text-xs text-gray-500">IT Department</p>
                      <p className="text-xs text-gray-400 mt-1">5 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-yellow-50 rounded">
                    <div className="flex-none pt-0.5 text-yellow-500">
                      <Clock />
                    </div>
                    <div>
                      <p className="font-medium text-sm">WiFi Issues</p>
                      <p className="text-xs text-gray-500">North Campus</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                    <BarChart />
                  </div>
                  <h4 className="font-medium">System Stats</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Open Tickets</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Response Time</span>
                    <span className="font-medium">3h 42m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Satisfaction</span>
                    <span className="font-medium">4.2/5</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <Zap />
                  </div>
                  <h4 className="font-medium">Admin Tools</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <a href="/it-support" className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                    <BarChart2 className="mx-auto" />
                    All Feedback
                  </a>
                  <a href="/admin/manage-tickets" className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                    <Flag className="mx-auto" />
                    Manage Tickets
                  </a>
                  <a href="/admin/user-management" className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                    <UserCheck className="mx-auto" />
                    Users
                  </a>
                  <a href="/admin/reports-analytics" className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-center">
                    <BarChart className="mx-auto" />
                    Reports
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* STAFF SECTION */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <ListChecks />
                Staff Portal
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assigned Tasks */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <ListChecks />
                  </div>
                  <h4 className="font-medium">Your Tasks</h4>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                    <div className="flex-none pt-0.5 text-blue-500">
                      <Cpu />
                    </div>
                    <div>
                      <p className="font-medium">Printer Setup</p>
                      <p className="text-xs text-gray-500">Room 205 • Due today</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                    <div className="flex-none pt-0.5 text-orange-500">
                      <Wrench />
                    </div>
                    <div>
                      <p className="font-medium">Chair Repair</p>
                      <p className="text-xs text-gray-500">Library • High priority</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Performance */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <Star />
                  </div>
                  <h4 className="font-medium">Your Performance</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Completed Tasks</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Rating</span>
                    <span className="font-medium">4.5/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>On Time</span>
                    <span className="font-medium">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 