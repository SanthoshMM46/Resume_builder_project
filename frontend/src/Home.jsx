import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">Build Your <span>Dream Resume</span></h1>
        <p className="home-subtitle">
          Create a professional, eye-catching resume in minutes. Stand out from the crowd and land your dream job with ResuMaker.
        </p>
        <div className="home-actions">
          <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
          <Link to="/register" className="btn btn-secondary btn-lg">Register</Link>
        </div>
      </div>
      <div className="home-features">
        <div className="feature-card">
          <span className="feature-icon">✨</span>
          <h3>Beautiful Templates</h3>
          <p>Choose from a variety of modern, professional templates designed to catch the eye.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⚡</span>
          <h3>Lightning Fast</h3>
          <p>Real-time preview means you see exactly what your resume looks like as you type.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🔒</span>
          <h3>Secure & Private</h3>
          <p>Your data is safely stored and only accessible by you. Export to PDF anytime.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
