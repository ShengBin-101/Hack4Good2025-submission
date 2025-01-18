import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function VerifyOTPPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get('userId');

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, otp }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg && !data.error) {
                    setMessage(data.msg);
                    setError('');
                } else {
                    setError(data.msg || 'Error verifying OTP');
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
            <h1>Verify OTP</h1>
            <form onSubmit={handleVerifyOTP}>
                <label>Enter OTP:</label>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <div className="button-container">
                    <button type="submit">Verify</button>
                </div>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <button type="button" onClick={() => navigate('/')}>Back to Login</button>
        </div>
    );
}

export default VerifyOTPPage;