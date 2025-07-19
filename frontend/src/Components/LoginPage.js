import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';
import { saveToken, getUserRole } from '../utils/tokenService';
import '../Styles/LoginPage.css'; // Import Tailwind CSS file
import ResponsiveNavbar from './Navbar';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await apiService.post('/login', { username, password });
      console.log("Password entered:", password);
      
      const { token, account_type } = res.data;

      saveToken(token);
      const userRole = account_type || getUserRole();

        switch (userRole) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'admin staff':
            navigate('/admin-staff/dashboard');
            break;  
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'tutor':
            navigate('/tutor/dashboard');
            break;
          default:
            navigate('/');
            break;
        }
    } catch (err) {
      console.error(err);
      setErrorMsg('Invalid username or password');
    }
  };

  return (
    <>
    <ResponsiveNavbar />
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
