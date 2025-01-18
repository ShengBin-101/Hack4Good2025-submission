import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuestManagementPage.css';

const QuestManagementPage = () => {
  const [quests, setQuests] = useState([]);
  const [newQuest, setNewQuest] = useState({ name: '', description: '', voucherValue: 0, cooldown: 0 });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = () => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quests`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setQuests(data))
      .catch((err) => console.error(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'voucherValue' && value < 0) {
      return; // Prevent negative values
    }
    if (name === 'cooldown' && value < 0) {
      return; // Prevent negative values
    }
    setNewQuest({ ...newQuest, [name]: value });
  };

  const handleAddQuest = () => {
    if (newQuest.name.trim() === '' || newQuest.description.trim() === '' || newQuest.voucherValue <= 0 || newQuest.cooldown <= 0) {
      setError('All fields must be filled and values must be greater than 0');
      return;
    }

    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newQuest),
    })
      .then((res) => res.json())
      .then((data) => {
        setQuests([...quests, data]);
        setNewQuest({ name: '', description: '', voucherValue: 0, cooldown: 0 });
        setError('');
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteQuest = (questId) => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quests/${questId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error deleting quest');
        setQuests(quests.filter((quest) => quest._id !== questId));
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="quest-management">
      <header className="common-header">
        <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
        <h1>Quest Management</h1>
        <button className="nav-button" onClick={() => navigate('/quest-approval')}>Quest Approval</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <main className="quest-main">
        <section className="quests-section">
          <h2>Active Quests</h2>
          <ul className="quest-list">
            {quests.length > 0 ? (
              quests.map((quest) => (
                <li key={quest._id} className="quest-item">
                  <div className="quest-info">
                    <h3>{quest.name}</h3>
                    <p>{quest.description}</p>
                    <p>Voucher Value: {quest.voucherValue}</p>
                    <p>Cooldown: {quest.cooldown} minutes</p>
                    <p>Status: {quest.status}</p>
                  </div>
                  <button className="delete-button" onClick={() => handleDeleteQuest(quest._id)}>Delete</button>
                </li>
              ))
            ) : (
              <p>No quests available</p>
            )}
          </ul>
        </section>
        <section className="add-quest-section">
          <h2>Create New Quest</h2>
          <label>
            <span>Quest Name:</span>
            <input
              type="text"
              name="name"
              value={newQuest.name}
              onChange={handleInputChange}
              placeholder="Quest Name"
            />
          </label>
          <label>
            <span>Voucher Value:</span>
            <input
              type="number"
              name="voucherValue"
              value={newQuest.voucherValue}
              onChange={handleInputChange}
              placeholder="Voucher Value"
            />
          </label>
          <label>
            <span>Description:</span>
            <input
              type="text"
              name="description"
              value={newQuest.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
          </label>
          <label>
            <span>Cooldown (minutes):</span>
            <input
              type="number"
              name="cooldown"
              value={newQuest.cooldown}
              onChange={handleInputChange}
              placeholder="Cooldown"
            />
          </label>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={handleAddQuest}>Add Quest</button>
        </section>
      </main>
    </div>
  );
};

export default QuestManagementPage;