// ForgotPasswordPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg && !data.error) {
                    setMessage(data.msg);
                    setError('');
                } else {
                    setError(data.msg || 'Error sending reset link');
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
            <h1>Forgot Password</h1>
            <form onSubmit={handleForgotPassword}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="button-container">
                    <button type="submit">Send Reset Link</button>
                </div>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <button type="button" onClick={() => navigate('/')}>Back to Login</button>
        </div>
    );
};

export default ForgotPasswordPage;