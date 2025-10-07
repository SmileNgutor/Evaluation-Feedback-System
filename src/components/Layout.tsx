import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import {
  Home,
  HardDrive,
  ClipboardList,
  Utensils,
  Wrench,
  BarChart2,
  Cpu,
  Coffee,
  ClipboardCheck,
  Ticket,
  LineChart,
  Users,
  ListChecks,
  CheckCircle,
  Star,
  UtensilsCrossed,
  Bell,
  Calendar,
  FileText,
  User,
  LogOut,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:ml-64">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden py-4 px-6 fixed top-0 left-0 z-50 bg-white w-full shadow-md">
        <button
          type="button"
          className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-gray-800 border border-gray-800 text-white text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-gray-950 focus:outline-none focus:bg-gray-900"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          Open Sidebar
        </button>
      </div>

      {/* Sidebar Container */}
      <div className={`hs-overlay [--auto-close:lg] lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 transform
        h-full fixed top-0 start-0 bottom-0 z-[60] bg-white border-e border-gray-200`}>
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header with logo and close button */}
          <header className="p-4 flex justify-between items-center gap-x-2">
            <Link to="/" className="flex-none focus:outline-none focus:opacity-80" aria-label="Brand">
              <div className="block h-9 w-auto fill-current text-gray-800">
                <span className="text-xl font-bold">Feedback System</span>
              </div>
            </Link>

            <div className="lg:hidden -me-2">
              <button
                type="button"
                className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </header>

          {/* Main Navigation Content */}
          <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div className="pb-0 px-2 w-full flex flex-col flex-wrap">
              <ul className="space-y-1">
                {/* Dashboard */}
                <li>
                  <Link
                    className={`flex items-center gap-x-3 py-2 px-2.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                      ${isActive('/') ? 'bg-gray-100 text-gray-800' : 'text-gray-800'}`}
                    to="/"
                  >
                    <Home className="size-4" />
                    Dashboard
                  </Link>
                </li>

                {/* Student Section */}
                <li>
                  <h3 className="mt-6 mb-2 px-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Student Portal
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        className={`flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                          ${isActive('/it-support-student') ? 'bg-gray-100 text-gray-800' : 'text-gray-800'}`}
                        to="/it-support-student"
                      >
                        <HardDrive className="size-4" />
                        IT Support
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                          ${isActive('/course-evaluation') ? 'bg-gray-100 text-gray-800' : 'text-gray-800'}`}
                        to="/course-evaluation"
                      >
                        <ClipboardList className="size-4" />
                        Course Evaluation
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                          ${isActive('/cafeteria-student') ? 'bg-gray-100 text-gray-800' : 'text-gray-800'}`}
                        to="/cafeteria-student"
                      >
                        <Utensils className="size-4" />
                        Cafeteria Feedback
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                          ${isActive('/class-student') ? 'bg-gray-100 text-gray-800' : 'text-gray-800'}`}
                        to="/class-student"
                      >
                        <Wrench className="size-4" />
                        Maintenance
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Faculty Section */}
                <li>
                  <h3 className="mt-6 mb-2 px-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Faculty Portal
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        className={`flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                          ${isActive('/course-feedback-faculty') ? 'bg-gray-100 text-gray-800' : 'text-gray-800'}`}
                        to="/course-feedback-faculty"
                      >
                        <BarChart2 className="size-4" />
                        Course Feedback
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/faculty/it-support"
                      >
                        <Cpu className="size-4" />
                        IT Support
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/cafeteria-student"
                      >
                        <Coffee className="size-4" />
                        Cafeteria Feedback
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/class-student"
                      >
                        <Wrench className="size-4" />
                        Maintenance
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Admin Section */}
                <li>
                  <h3 className="mt-6 mb-2 px-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Admin Portal
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        className={`flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                          ${isActive('/it-support') ? 'bg-gray-100 text-gray-800' : 'text-gray-800'}`}
                        to="/it-support"
                      >
                        <ClipboardCheck className="size-4" />
                        All Feedback
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/admin/manage-tickets"
                      >
                        <Ticket className="size-4" />
                        Manage Tickets
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/admin/reports-analytics"
                      >
                        <LineChart className="size-4" />
                        Reports & Analytics
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100
                          ${isActive('/user-management') ? 'bg-gray-100 text-gray-800' : 'text-gray-800'}`}
                        to="/user-management"
                      >
                        <Users className="size-4" />
                        User Management
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Staff Section */}
                <li>
                  <h3 className="mt-6 mb-2 px-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Staff Portal
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/staff/assigned-tasks"
                      >
                        <ListChecks className="size-4" />
                        Assigned Tasks
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/staff/update-status"
                      >
                        <CheckCircle className="size-4" />
                        Update Status
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/staff/feedback-review"
                      >
                        <Star className="size-4" />
                        Performance Feedback
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/staff/cafeteria-dashboard"
                      >
                        <UtensilsCrossed className="size-4" />
                        Cafeteria Dashboard
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* General Section */}
                <li>
                  <h3 className="mt-6 mb-2 px-2.5 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    General
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/notifications"
                      >
                        <Bell className="size-4" />
                        Notifications
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/calendar"
                      >
                        <Calendar className="size-4" />
                        Calendar
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-gray-800"
                        to="/documentation"
                      >
                        <FileText className="size-4" />
                        Documentation
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>

          {/* Footer with User Section */}
          <footer className="mt-auto p-2 border-t border-gray-200">
            <div className="px-2 py-4">
              <div className="flex items-center gap-x-3.5 mb-2">
                <div className="shrink-0 size-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-base text-gray-800">{user?.full_name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</div>
                </div>
              </div>

              <Link
                className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                to="/profile"
              >
                <User className="size-4" />
                Profile
              </Link>

              <button
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-x-3 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <LogOut className="size-4" />
                Log Out
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* Page Content */}
      <main className="lg:pl-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
