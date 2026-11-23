import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 20px',
        textAlign: 'center',
        color: '#183b3b',
        background: '#f2f8f6',
      }}
    >
      <div style={{ maxWidth: '500px' }}>
        <div style={{ color: '#00877f', marginBottom: '15px' }}>
          <Compass size={65} strokeWidth={1.5} />
        </div>

        <h1
          style={{
            fontSize: 'clamp(75px, 15vw, 120px)',
            lineHeight: 1,
            margin: 0,
            color: '#006D6F',
            fontFamily: 'Playfair Display, Georgia, serif',
          }}
        >
          404
        </h1>

        <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          Looks like you've wandered off the map.
        </h2>

        <p style={{ color: '#637777', lineHeight: 1.7 }}>
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to exploring Goa.
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '15px',
            background: '#006D6F',
            color: '#fff',
            padding: '13px 22px',
            borderRadius: '9px',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={17} /> Back to home
        </Link>
      </div>
    </main>
  );
}
