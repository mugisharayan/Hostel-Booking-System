import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginSignup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Try to call backend signup endpoint
    try {
      const res = await fetch('/api/students/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      const data = await res.json();
      console.log('Signup response', data);
      navigate('/');
    } catch (err) {
      console.error('Signup error', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="input-label">Full name</label>
          <input className="auth-input" type="text" value={name} onChange={e => setName(e.target.value)} required />

          <label className="input-label">Email</label>
          <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />

          <label className="input-label">Phone</label>
          <input className="auth-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />

          <button className="auth-button" type="submit">Create account</button>
        </form>
        <p className="auth-footer">
          Already registered? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
