import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ViewTasksPage.css';

const ViewTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserTasks();
    }, []);

    const fetchUserTasks = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/tasks/${user._id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((err) => console.error(err));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="view-tasks-container">
            <header className="view-tasks-header">
                <h1>View Tasks</h1>
                <button className="nav-button" onClick={() => navigate('/user-dashboard')}>User Dashboard</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </header>
            <main className="view-tasks-main">
                <section className="tasks-section">
                    <h2>Your Task Submissions</h2>
                    <ul className="task-list">
                        {tasks.map((task) => (
                            <li key={task._id} className="task-item">
                                <div className="task-info">
                                    <h3>{task.taskDescription}</h3>
                                    <p>Voucher Request: {task.voucherRequest}</p>
                                    <p>Date Completed: {new Date(task.dateCompleted).toLocaleDateString()}</p>
                                    <p>Status: {task.status}</p>
                                    {task.taskPicturePath && (
                                        <img src={`${process.env.REACT_APP_BACKEND_BASEURL}/assets/${task.taskPicturePath}`} alt="Task Proof" className="task-picture" />
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default ViewTasksPage;