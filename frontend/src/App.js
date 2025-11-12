import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminLayout from './components/AdminLayout';
import AdminDashboardNew from './pages/Admin/AdminDashboard';
import NewInterviewPro from './pages/Admin/NewInterview';
import SubmittedInterviews from './pages/Admin/SubmittedInterviews';
import SavedQuestions from './pages/Admin/SavedQuestions';
import Users from './pages/Admin/Users';
import InterviewDetails from './pages/Admin/InterviewDetails';
import HomePage from './pages/Users/HomePage';
import InterviewPage from './pages/Users/InterviewPage';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/interview/:slug" element={<InterviewPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={
          <AuthGuard requiredRole="admin">
            <AdminLayout />
          </AuthGuard>
        }>
          <Route path="" element={<AdminDashboardNew />} />
          <Route path="dashboard" element={<AdminDashboardNew />} />
          <Route path="new-interview" element={<NewInterviewPro />} />
          <Route path="submitted-interviews" element={<SubmittedInterviews />} />
          <Route path="interview-details/:id" element={<InterviewDetails />} />
          <Route path="saved-questions" element={<SavedQuestions />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
