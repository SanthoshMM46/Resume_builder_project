import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';
import Home from './Home';
import './index.css';

function Login({ setToken, setUsername, setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setUsername(data.username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setIsAdmin(data.isAdmin);
        localStorage.setItem('isAdmin', data.isAdmin);
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to server.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/register" className="text-primary">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to server.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" required className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-primary">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  const logout = () => {
    setToken(null);
    setUsername(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <div className="app-container">
        {token && (
          <nav className="navbar">
            <Link to="/" className="navbar-brand">
              <span style={{ fontSize: '1.5rem' }}>📄</span> ResuMaker
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 500 }}>Hello, {username}</span>
              {isAdmin && <Link to="/admin" className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>🛡️ Admin</Link>}
              <button onClick={logout} className="btn btn-secondary">Logout</button>
            </div>
          </nav>
        )}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={!token ? <Login setToken={setToken} setUsername={setUsername} setIsAdmin={setIsAdmin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
            <Route path="/admin" element={token && isAdmin ? <AdminPanel token={token} /> : <Navigate to="/" />} />
            <Route path="/" element={token ? <Dashboard token={token} /> : <Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
