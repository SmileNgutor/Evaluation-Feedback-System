import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ITSupportStudent from './pages/ITSupportStudent';
import CourseEvaluation from './pages/CourseEvaluation';
import CafeteriaStudent from './pages/CafeteriaStudent';
import ClassStudent from './pages/ClassStudent';
import CourseFeedbackFaculty from './pages/CourseFeedbackFaculty';
import ITSupport from './pages/ITSupport';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import Register from './pages/Register';

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
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/it-support-student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <ITSupportStudent />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/course-evaluation"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <CourseEvaluation />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cafeteria-student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <CafeteriaStudent />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/class-student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <ClassStudent />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/course-feedback-faculty"
            element={
              <ProtectedRoute allowedRoles={['staff', 'department_head', 'admin']}>
                <Layout>
                  <CourseFeedbackFaculty />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/it-support"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <ITSupport />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
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
