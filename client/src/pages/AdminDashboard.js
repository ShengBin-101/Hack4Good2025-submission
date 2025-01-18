import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <header className="common-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <main className="admin-main">
        <button className="nav-button" onClick={() => navigate('/admin-listings')}>Inventory</button>
        <button className="nav-button" onClick={() => navigate('/account-management')}>Account Management</button>
        <button className="nav-button" onClick={() => navigate('/task-category-management')}>Task Category Management</button>
        <button className="nav-button" onClick={() => navigate('/admin-task-management')}>Task Approval</button>
        <button className="nav-button" onClick={() => navigate('/quest-management')}>Quest Management</button>
        <button className="nav-button" onClick={() => navigate('/transaction-management')}>Transaction Management</button>
      </main>
    </div>
  );
};

export default AdminDashboard;