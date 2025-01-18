import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import AccountManagement from './pages/AccountManagement';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Marketplace from './pages/Marketplace';
import UserDashboard from './pages/UserDashboard';
import PastRedemptions from './pages/PastRedemptions';
import AdminInventory from './pages/AdminInventory';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyOTPPage from './pages/VerifyOTPPage';
import TaskCategoryManagement from './pages/TaskCategoryManagement';
import TaskSubmission from './pages/TaskSubmissionPage';
import ViewTasksPage from './pages/ViewTasksPage';
import AdminTaskManagement from './pages/AdminTaskManagement';
import QuestManagementPage from './pages/QuestManagementPage';
import QuestApprovalPage from './pages/QuestApprovalPage';
import QuestSubmissionPage from './pages/QuestSubmissionPage';
import TransactionManagementPage from './pages/TransactionManagementPage'; // Import the new page


const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={user && user.admin ? <Navigate to="/admin-dashboard" /> : <HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account-management" element={<ProtectedRoute adminOnly={true}><AccountManagement /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/past-redemptions" element={<ProtectedRoute><PastRedemptions /></ProtectedRoute>} />
        <Route path="/admin-listings" element={<ProtectedRoute adminOnly={true}><AdminInventory /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/task-category-management" element={<ProtectedRoute adminOnly={true}><TaskCategoryManagement /></ProtectedRoute>} />
        <Route path="/task-submission" element={<ProtectedRoute><TaskSubmission /></ProtectedRoute>} />
        <Route path="/view-tasks" element={<ProtectedRoute><ViewTasksPage /></ProtectedRoute>} />
        <Route path="/admin-task-management" element={<ProtectedRoute adminOnly={true}><AdminTaskManagement /></ProtectedRoute>} />
        <Route path="/quest-management" element={<ProtectedRoute adminOnly={true}><QuestManagementPage /></ProtectedRoute>} />
        <Route path="/quest-approval" element={<ProtectedRoute adminOnly={true}><QuestApprovalPage /></ProtectedRoute>} />
        <Route path="/quest-submission" element={<ProtectedRoute><QuestSubmissionPage /></ProtectedRoute>} />
        <Route path="/transaction-management" element={<ProtectedRoute adminOnly={true}><TransactionManagementPage /></ProtectedRoute>} /> {/* New route */}
      </Routes>
    </Router>
  );
};

export default App;