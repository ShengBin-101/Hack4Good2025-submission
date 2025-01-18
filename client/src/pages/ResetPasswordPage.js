// ResetPasswordPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, token, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg && !data.error) {
                    setMessage(data.msg);
                    setError('');
                    navigate('/');
                } else {
                    setError(data.msg || 'Error resetting password');
                    setMessage('');
                }
            })
            .catch((err) => {
                setError(err.message);
                setMessage('');
            });
    };

    return (
        <div className="form-container">
            <h1>Reset Password</h1>
            <form onSubmit={handleResetPassword}>
                <label>New Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label>Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="button-container">
                    <button type="submit">Reset Password</button>
                </div>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default ResetPasswordPage;