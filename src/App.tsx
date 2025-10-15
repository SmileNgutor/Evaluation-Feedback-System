import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ITSupportStudent from './pages/ITSupportStudent.tsx';
import CourseEvaluation from './pages/CourseEvaluation.tsx';
import CafeteriaStudent from './pages/CafeteriaStudent.tsx';
import ClassStudent from './pages/ClassStudent.tsx';
import CourseFeedbackFaculty from './pages/CourseFeedbackFaculty.tsx';
import ITSupport from './pages/ITSupport.tsx';
import UserManagement from './pages/UserManagement.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import AdminManageTickets from "./pages/admin-manage-tickets.tsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with layout */}
          <Route
            path="/"
            element={
                <Layout>
                  <Dashboard />
                </Layout>
            }
          />
          <Route
            path="/it-support-student"
            element={
                <Layout>
                  <ITSupportStudent />
                </Layout>
            }
          />
          <Route
            path="/course-evaluation"
            element={
                <Layout>
                  <CourseEvaluation />
                </Layout>
            }
          />
          <Route
            path="/cafeteria-student"
            element={
                <Layout>
                  <CafeteriaStudent />
                </Layout>
            }
          />
          <Route
            path="/class-student"
            element={
                <Layout>
                  <ClassStudent />
                </Layout>
            }
          />
          <Route
            path="/course-feedback-faculty"
            element={
                <Layout>
                  <CourseFeedbackFaculty />
                </Layout>
            }
          />
          <Route
            path="/it-support"
            element={
                <Layout>
                  <ITSupport />
                </Layout>
            }
          />
            <Route
            path="/manage-tickets"
            element={
                <Layout>
                  <AdminManageTickets />
                </Layout>
            }
          />
          <Route
            path="/user-management"
            element={
                <Layout>
                  <UserManagement />
                </Layout>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
