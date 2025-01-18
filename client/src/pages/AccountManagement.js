import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountManagement.css';

const AccountManagement = () => {
    const [activeTab, setActiveTab] = useState('pending'); // State to manage active tab
    const [viewMode, setViewMode] = useState('users'); // State to manage view mode
    const [pendingUsers, setPendingUsers] = useState([]);
    const [existingUsers, setExistingUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [userPicture, setUserPicture] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchPendingUsers = () => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/admin/pending`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error fetching pending users');
                }
                return res.json();
            })
            .then((data) => {
                setPendingUsers(data);
            })
            .catch((err) => console.error(err));
    };

    const fetchExistingUsers = () => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/admin/existing`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Error fetching existing users');
                }
                return res.json();
            })
            .then((data) => {
                setExistingUsers(data);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchPendingUsers();
        fetchExistingUsers();
    }, []);

    const handleApprove = (userId) => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/admin/approve/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error approving user');
                fetchPendingUsers();
            })
            .catch((err) => console.error(err));
    };

    const handleReject = (userId) => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/admin/reject/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error rejecting user');
                fetchPendingUsers();
            })
            .catch((err) => console.error(err));
    };

    const handleDelete = (userId) => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/admin/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error deleting user');
                setExistingUsers((prev) => prev.filter((user) => user._id !== userId));
            })
            .catch((err) => console.error(err));
    };

    const handleRegisterAdmin = () => {
        setActiveTab('register-admin');
        setViewMode('register');
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate input fields
        if (!name || !email || !birthday || !password) {
            setError('All fields except Profile Picture URL are required.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('birthday', birthday);
        formData.append('password', password);
        if (userPicture) {
            formData.append('picture', userPicture);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/register-admin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || 'Registration error');
            }

            const data = await response.json();
            setMessage('Admin registered successfully');
            setError('');
            // Clear form fields
            setName('');
            setEmail('');
            setBirthday('');
            setPassword('');
            setUserPicture(null);
            fetchExistingUsers();
        } catch (err) {
            console.error(err);
            setError(err.message);
            setMessage('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="account-management">
            <header className="admin-header">

                <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
                <h1>Account Management</h1>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </header>
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'pending' ? 'active' : 'inactive'}`}
                    onClick={() => {
                        setActiveTab('pending');
                        setViewMode('users');
                    }}
                >
                    Users Waiting for Approval
                </button>
                <button
                    className={`tab-button ${activeTab === 'existing' ? 'active' : 'inactive'}`}
                    onClick={() => {
                        setActiveTab('existing');
                        setViewMode('users');
                    }}
                >
                    Existing Users
                </button>
                <button className={`tab-button ${activeTab === 'register-admin' ? 'active' : ''}`} onClick={handleRegisterAdmin}>Register Admin</button>
            </div>
            {viewMode === 'users' && activeTab === 'pending' && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="approve-button" onClick={() => handleApprove(user._id)}>Approve</button>
                                        <button className="reject-button" onClick={() => handleReject(user._id)}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {viewMode === 'users' && activeTab === 'existing' && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {existingUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.status}</td>
                                    <td>
                                        <button className="delete-button" onClick={() => handleDelete(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {viewMode === 'register' && activeTab === 'register-admin' && (
                <div className="form-container">
                    <h1>Register Admin</h1>
                    <form onSubmit={handleRegister}>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Birthday:</label>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Profile Picture (Optional):</label>
                        <div className="file-input-container">
                            <input
                                type="file"
                                accept="image/*"
                                id="file-upload"
                                onChange={(e) => setUserPicture(e.target.files[0])}
                                hidden
                            />
                            <label htmlFor="file-upload" className="file-upload-label">
                                Choose File
                            </label>
                        </div>
                        <div className="button-container">
                            <button type="submit">Register</button>
                        </div>
                        {message && <p className="message">{message}</p>}
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default AccountManagement;