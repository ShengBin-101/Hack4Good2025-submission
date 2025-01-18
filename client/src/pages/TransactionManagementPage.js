import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TransactionManagementPage.css';

const TransactionManagementPage = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/transactions`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error(err));
  };

  const handleApproveTransaction = (transactionId) => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/transactions/${transactionId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchTransactions(); // Refresh the transaction list
      })
      .catch((err) => console.error(err));
  };

  const handleRejectTransaction = (transactionId) => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/transactions/${transactionId}/reject`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchTransactions(); // Refresh the transaction list
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="transaction-management">
      <header className="common-header">
        <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
        <h1>Transaction Management</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <main className="transaction-main">
        <section className="transactions-section">
          <h2>Incoming Orders</h2>
          <ul className="transaction-list">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <li key={transaction._id} className="transaction-item">
                  <div className="transaction-info">
                    <h3>{transaction.productName}</h3>
                    <p>Quantity: {transaction.productQuantity}</p>
                    <p>Vouchers Used: {transaction.voucherTransaction}</p>
                    <p>Date: {transaction.dateTransaction}</p>
                    <p>Time: {transaction.timeTransaction}</p>
                    <p>Status: {transaction.status}</p>
                  </div>
                  <div className="transaction-actions">
                    {transaction.status === 'pending' && (
                      <>
                        <button className="approve-button" onClick={() => handleApproveTransaction(transaction._id)}>Approve</button>
                        <button className="reject-button" onClick={() => handleRejectTransaction(transaction._id)}>Reject</button>
                      </>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p>No incoming orders found.</p>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default TransactionManagementPage;