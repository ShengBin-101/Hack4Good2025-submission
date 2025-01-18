import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [profilePicture, setProfilePicture] = useState('');
  const [vouchers, setVoucherCount] = useState(0);
  const [goal, setGoal] = useState(0);
  const [taskCategories, setTaskCategories] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [quests, setQuests] = useState([]);
  const [pendingQuests, setPendingQuests] = useState([]);
  const [approvedQuests, setApprovedQuests] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    window.scrollTo(0, 0);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setProfilePicture(
        user.userPicturePath
          ? `${process.env.REACT_APP_BACKEND_BASEURL}/assets/${user.userPicturePath}` // Full URL for profile picture
          : require('../assets/default-image-url.jpg') // Default image
      );
      setVoucherCount(user.voucher || 0);
      setGoal(user.goal || 0);
      setUserName(user.name || 'Guest'); // Set the user's name
    } else {
      setProfilePicture(require('../assets/default-image-url.jpg')); // Default image
      setVoucherCount(0);
    }
    fetchUserTransactions();
    // Fetch task categories and quests
    fetchTaskCategories();
    fetchPendingTasks();
    fetchApprovedTasks();
    fetchQuests();
    fetchPendingQuestSubmissions();
    fetchApprovedQuestSubmissions();
  }, [location.state]);

  const fetchTaskCategories = () => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/task-categories`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setTaskCategories(data))
      .catch((err) => console.error('Error fetching task categories:', err));
  };

  const fetchPendingTasks = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/tasks/${user._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setPendingTasks(data.filter(task => task.status === 'pending')))
      .catch((err) => console.error('Error fetching pending tasks:', err));
  };

  const fetchApprovedTasks = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/tasks/${user._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setApprovedTasks(data.filter(task => task.status === 'approved')))
      .catch((err) => console.error('Error fetching approved tasks:', err));
  };

  const fetchUserTransactions = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/transactions/user/${user._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error('Error fetching transactions:', err));
  };

  const fetchQuests = () => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quests`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setQuests(data.filter(quest => quest.status === 'available')))
      .catch((err) => console.error('Error fetching quests:', err));
  };

  const fetchPendingQuestSubmissions = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quest-submissions/${user._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setPendingQuests(data.filter(submission => submission.status === 'pending')))
      .catch((err) => console.error('Error fetching pending quest submissions:', err));
  };

  const fetchApprovedQuestSubmissions = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quest-submissions/${user._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setApprovedQuests(data.filter(submission => submission.status === 'approved')))
      .catch((err) => console.error('Error fetching approved quest submissions:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleTaskClick = (category) => {
    navigate('/task-submission', { state: { selectedCategory: category } });
  };

  const handleGoalChange = (event) => {
    setGoal(event.target.value);
  };

  const handleQuestClick = (quest) => {
    navigate('/quest-submission', { state: { selectedQuest: quest } });
  };

  const handleDeleteTaskSubmission = (taskId) => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchPendingTasks(); // Refresh the pending task submissions list
      })
      .catch((err) => console.error('Error deleting task submission:', err));
  };

  const handleDeleteQuestSubmission = (submissionId) => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quest-submissions/pending/${submissionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchPendingQuestSubmissions(); // Refresh the pending quest submissions list
      })
      .catch((err) => console.error('Error deleting quest submission:', err));
  };

  return (
    <div className="user-dashboard">
      <header className="user-header">
        <h1>User Dashboard</h1>
        <button className="nav-button" onClick={() => navigate('/marketplace')}>Back to Marketplace</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab-button ${activeTab === 'transactionHistory' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactionHistory')}
        >
          Transaction History
        </button>
        <button
          className={`tab-button ${activeTab === 'quests' ? 'active' : ''}`}
          onClick={() => setActiveTab('quests')}
        >
          Quests
        </button>
        <button
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
      </div>
      {activeTab === 'profile' && (
        <div className="profile-container">
          <div className="profile-section" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={profilePicture}
              alt="Profile"
              className="profile-picture"
              style={{ width: '100px', height: '100px', borderRadius: '50%' }} // Circular image style
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <p style={{ margin: 0 }}>Name: {userName}</p> {/* Display the user's name */}
              <p style={{ margin: 0 }}>Vouchers: {vouchers}</p>
            </div>
          </div>
          <div className="goal-section">
            <h2>Set Your Goal</h2>
            <p>Vouchers needed to reach goal: {Math.max(0, goal - vouchers)}</p>
            <input
              type="range"
              min="0"
              max="1000"
              value={goal}
              onChange={handleGoalChange}
              className="goal-slider"
            />
            <p>Goal: {goal} vouchers</p>
          </div>
        </div>
      )}
      {activeTab === 'transactionHistory' && (
        <div className="transaction-history-section">
          <h2>Transaction History</h2>
          {transactions.length > 0 ? (
            <ul className="transaction-list">
              {transactions.map((transaction) => (
                <li key={transaction._id} className="transaction-item">
                  <p>Product: {transaction.productName}</p>
                  <p>Quantity: {transaction.productQuantity}</p>
                  <p>Date: {transaction.dateTransaction}</p>
                  <p>Time: {transaction.timeTransaction}</p>
                  <p>Vouchers Used: {transaction.voucherTransaction}</p>
                  <p>Status: {transaction.status}</p> {/* Display the status */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      )}
      {activeTab === 'quests' && (
        <div className="quests-container">
          <div className="available-quests-section">
            <h2>Available Quests</h2>
            <div className="quests-list-container">
              {quests.length > 0 ? (
                <ul className="quests-list">
                  {quests.filter(quest => !pendingQuests.includes(quest._id)).map((quest) => (
                    <li
                      key={quest._id}
                      className="quest-item"
                      onClick={() => handleQuestClick(quest)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="quest-info">
                        <div className="quest-details">
                          <h3>{quest.name}</h3>
                          <p>{quest.description}</p>
                        </div>
                        <div className="quest-meta">
                          <p>Voucher Value: {quest.voucherValue}</p>
                          <p>Cooldown: {quest.cooldown} minutes</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No quests available at the moment.</p>
              )}
            </div>
          </div>
          <div className="pending-quests-section">
            <h2>Pending Quests</h2>
            <div className="quests-list-container">
              {pendingQuests.length > 0 ? (
                <ul className="quests-list">
                  {pendingQuests.map((submission) => (
                    <li key={submission._id} className="quest-item">
                      <div className="quest-submission-info">
                        <h3>{submission.questId?.name}</h3>
                        <p>Status: {submission.status}</p>
                        {submission.proofImagePath && (
                          <img src={`${process.env.REACT_APP_BACKEND_BASEURL}/assets/${submission.proofImagePath}`} alt="Quest Proof" className="quest-proof-picture" />
                        )}
                      </div>
                      <button className="delete-button" onClick={() => handleDeleteQuestSubmission(submission._id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending quests found.</p>
              )}
            </div>
          </div>
          <div className="approved-quests-section">
            <h2>Approved Quests</h2>
            <div className="quests-list-container">
              {approvedQuests.length > 0 ? (
                <ul className="quests-list">
                  {approvedQuests.map((submission) => (
                    <li key={submission._id} className="quest-item">
                      <div className="quest-submission-info">
                        <h3>{submission.questId?.name}</h3>
                        <p>Status: {submission.status}</p>
                        {submission.proofImagePath && (
                          <img src={`${process.env.REACT_APP_BACKEND_BASEURL}/assets/${submission.proofImagePath}`} alt="Quest Proof" className="quest-proof-picture" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No approved quests found.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {activeTab === 'tasks' && (
        <div className="tasks-container">
          <div className="available-tasks-section">
            <h2>Available Task Categories</h2>
            <div className="tasks-list-container">
              {taskCategories.length > 0 ? (
                <ul className="tasks-list">
                  {taskCategories.map((category) => (
                    <li
                      key={category._id}
                      className="task-item"
                      onClick={() => handleTaskClick(category)} // Attach click handler
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="task-info">
                        <div className="task-details">
                          <h3>{category.name}</h3>
                          <p>{category.description}</p>
                        </div>
                        <div className="task-meta">
                          <p>Voucher Value: {category.voucherValue}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No task categories available at the moment.</p>
              )}
            </div>
          </div>
          <div className="pending-tasks-section">
            <h2>Pending Tasks</h2>
            <div className="tasks-list-container">
              {pendingTasks.length > 0 ? (
                <ul className="tasks-list">
                  {pendingTasks.map((task) => (
                    <li key={task._id} className="task-item">
                      <div className="task-submission-info">
                        <h3>{task.taskDescription}</h3>
                        <p>Status: {task.status}</p>
                        {task.taskPicturePath && (
                          <img src={`${process.env.REACT_APP_BACKEND_BASEURL}/assets/${task.taskPicturePath}`} alt="Task Proof" className="task-proof-picture" />
                        )}
                      </div>
                      <button className="delete-button" onClick={() => handleDeleteTaskSubmission(task._id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending tasks found.</p>
              )}
            </div>
          </div>
          <div className="approved-tasks-section">
            <h2>Approved Tasks</h2>
            <div className="tasks-list-container">
              {approvedTasks.length > 0 ? (
                <ul className="tasks-list">
                  {approvedTasks.map((task) => (
                    <li key={task._id} className="task-item">
                      <div className="task-submission-info">
                        <h3>{task.taskDescription}</h3>
                        <p>Status: {task.status}</p>
                        {task.taskPicturePath && (
                          <img src={`${process.env.REACT_APP_BACKEND_BASEURL}/assets/${task.taskPicturePath}`} alt="Task Proof" className="task-proof-picture" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No approved tasks found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;