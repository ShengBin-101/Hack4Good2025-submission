import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css';
import icon from '../assets/logo.jpg'; // Import the image

function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        if (res.status === 400) {
          throw new Error('Wrong Login Credentials');
        }
        throw new Error('Login error');
      })
      .then((data) => {
        console.log('Login Data:', data);
        localStorage.setItem('token', data.token); // Store the token
        localStorage.setItem('user', JSON.stringify(data.user)); // Store the user info
        if (data.user.admin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/marketplace');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="homepage">
      <img src={icon} alt="Icon" className="icon" /> {/* Add the icon */}
      <div className="login-form-container">
        <h1>Minimart</h1>
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="button-container">
            <button type="submit">Login</button>
          </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Don’t have an account?{' '}
          <span onClick={() => navigate('/register')}>Register</span>
        </p>
        <p>
          <span onClick={handleForgotPassword}>
            Forgot Password?
          </span>
        </p>
      </div>
    </div>
  );
}

export default HomePage;