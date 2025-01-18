import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [userPicture, setUserPicture] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/register`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || 'Registration error');
            }

            const data = await response.json();
            console.log(data);
            navigate(`/verify-otp?userId=${data._id}`);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="form-container">
            <h1>Register</h1>
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
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUserPicture(e.target.files[0])}
                />
                <button type="submit">Register</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default RegisterPage;