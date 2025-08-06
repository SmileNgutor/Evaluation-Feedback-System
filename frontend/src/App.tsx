import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main routes with layout */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/it-support-student" element={<Layout><ITSupportStudent /></Layout>} />
        <Route path="/course-evaluation" element={<Layout><CourseEvaluation /></Layout>} />
        <Route path="/cafeteria-student" element={<Layout><CafeteriaStudent /></Layout>} />
        <Route path="/class-student" element={<Layout><ClassStudent /></Layout>} />
        <Route path="/course-feedback-faculty" element={<Layout><CourseFeedbackFaculty /></Layout>} />
        <Route path="/it-support" element={<Layout><ITSupport /></Layout>} />
        <Route path="/user-management" element={<Layout><UserManagement /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
