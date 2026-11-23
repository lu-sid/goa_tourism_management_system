import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserRound,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-react';

import AuthLayout from '../../layouts/AuthLayout';
import useAuth from '../../hooks/useAuth';
import { getErrorMessage } from '../../services/api';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

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

    if (form.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password
      });

      navigate('/profile', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join us and make your next Goa trip memorable."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label">
          Full name
          <span className="auth-input-wrap">
            <UserRound size={18} />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
              minLength={2}
              required
            />
          </span>
        </label>

        <label className="auth-label">
          Email address
          <span className="auth-input-wrap">
            <Mail size={18} />
            <input
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
          Phone number <span className="auth-optional">(optional)</span>
          <span className="auth-input-wrap">
            <Phone size={18} />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Your contact number"
              autoComplete="tel"
            />
          </span>
        </label>

        <label className="auth-label">
          Password
          <span className="auth-input-wrap">
            <Lock size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
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

        <label className="auth-label">
          Confirm password
          <span className="auth-input-wrap">
            <Lock size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Enter your password again"
              autoComplete="new-password"
              required
            />
          </span>
        </label>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-submit" type="submit" disabled={loading}>
          <UserPlus size={18} />
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account?
        <Link to="/login">Sign in</Link>
      </div>
    </AuthLayout>
  );
}
