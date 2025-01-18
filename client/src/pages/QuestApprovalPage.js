import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuestApprovalPage.css';

const QuestApprovalPage = () => {
  const [questSubmissions, setQuestSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestSubmissions();
  }, []);

  const fetchQuestSubmissions = () => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quest-submissions`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setQuestSubmissions(data))
      .catch((err) => console.error(err));
  };

  const handleApproveSubmission = (submissionId) => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quest-submissions/${submissionId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchQuestSubmissions(); // Refresh the quest submissions list
      })
      .catch((err) => console.error(err));
  };

  const handleRejectSubmission = (submissionId) => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quest-submissions/${submissionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchQuestSubmissions(); // Refresh the quest submissions list
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="quest-approval">
      <header className="common-header">
        
        <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
        <h1>Quest Approval</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <main className="quest-main">
        <section className="quest-submissions-section">
          <h2>Quest Submissions</h2>
          <ul className="quest-submission-list">
            {questSubmissions.map((submission) => (
              <li key={submission._id} className="quest-submission-item">
                <div className="quest-submission-info">
                  <h3>{submission.questId.name}</h3>
                  <p>{submission.questId.description}</p>
                  <p>Voucher Value: {submission.questId.voucherValue}</p>
                  <p>User: {submission.userId.username}</p>
                  <p>Status: {submission.status}</p>
                  {submission.proofImagePath && (
                    <img src={`${process.env.REACT_APP_BACKEND_BASEURL}/assets/${submission.proofImagePath}`} alt="Quest Proof" className="quest-proof-picture" />
                  )}
                </div>
                <div className="quest-submission-actions">
                  <button className="approve-button" onClick={() => handleApproveSubmission(submission._id)}>Approve</button>
                  <button className="reject-button" onClick={() => handleRejectSubmission(submission._id)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default QuestApprovalPage;