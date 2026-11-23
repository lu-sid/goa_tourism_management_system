import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <div className="auth-container">
        <Link to="/" className="auth-brand">
          <MapPin size={27} />
          <span>Sushegad Goa</span>
        </Link>

        <section className="auth-card">
          <Link to="/" className="auth-back">
            <ArrowLeft size={16} />
            Back to exploring Goa
          </Link>

          <div className="auth-heading">
            <span className="auth-eyebrow">YOUR GOA JOURNEY STARTS HERE</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          {children}
        </section>

        <p className="auth-footer">
          Discover Goa at your own pace. Made for the love of Goa.
        </p>
      </div>
    </main>
  );
}
