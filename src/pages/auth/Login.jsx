import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout';
import useAuth from '../../hooks/useAuth';
import { getErrorMessage } from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box'
  };

  function handleChange(event) {
    setForm(previous => ({
      ...previous,
      [event.target.name]: event.target.value
    }));

    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const user = await login({
        email: form.email.trim(),
        password: form.password
      });

      const destination =
        location.state?.from?.pathname ||
        (user.role === 'admin' ? '/admin' : '/profile');

      navigate(destination, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue planning your Goa experience."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label">
          Email address
          <span className="auth-input-wrap">
            <Mail size={18} />
            <input
              style={inputStyle}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </span>
        </label>

        <label className="auth-label">
          Password
          <span className="auth-input-wrap">
            <Lock size={18} />
            <input
              style={inputStyle}
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-eye"
              onClick={() => setShowPassword(value => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-submit" type="submit" disabled={loading}>
          <LogIn size={18} />
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="auth-switch">
        New to Sushegad Goa?
        <Link to="/register">Create an account</Link>
      </div>
    </AuthLayout>
  );
}
