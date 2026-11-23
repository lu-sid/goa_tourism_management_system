import React from 'react';
import { useEffect, useState } from 'react';
import { UserRound, Mail, Phone, Save } from 'lucide-react';
import { getCurrentUser, updateProfile } from '../../services/authService';

export default function Profile() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const user = getCurrentUser();

      if (user) {
        setForm({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        });
      }
    } catch (err) {
      setError('Could not load your profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await updateProfile({
        name: form.name,
        phone: form.phone,
      });

      const updatedUser = response?.data?.user || response?.data;

      if (updatedUser) {
        localStorage.setItem('sushegad_user', JSON.stringify(updatedUser));
      }

      setMessage('Your profile has been updated successfully.');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to update your profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '13px',
    border: '1px solid #d8e4e1',
    borderRadius: '8px',
    marginTop: '8px',
    fontSize: '15px',
    boxSizing: 'border-box',
  };

  if (loading) {
    return <p style={{ padding: '40px' }}>Loading your profile...</p>;
  }

  return (
    <main style={{ padding: '55px 7%', color: '#183b3b', minHeight: '65vh' }}>
      <div style={{ maxWidth: '700px', margin: 'auto' }}>
        <div style={{ color: '#00877f' }}>
          <UserRound size={36} />
        </div>

        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          My Profile
        </h1>

        <p style={{ color: '#637777', lineHeight: 1.7 }}>
          Manage your personal information and account details.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 5px 25px rgba(0,0,0,.07)',
            marginTop: '25px',
          }}
        >
          <label style={{ fontWeight: 600 }}>
            Full name
            <input
              style={inputStyle}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </label>

          <label style={{ display: 'block', marginTop: '22px', fontWeight: 600 }}>
            Email address
            <div style={{ position: 'relative' }}>
              <Mail
                size={17}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '23px',
                  color: '#829693',
                }}
              />
              <input
                style={{ ...inputStyle, paddingLeft: '40px' }}
                type="email"
                name="email"
                value={form.email}
                disabled
              />
            </div>
            <small style={{ color: '#829693', fontWeight: 400 }}>
              Email address cannot be changed here.
            </small>
          </label>

          <label style={{ display: 'block', marginTop: '22px', fontWeight: 600 }}>
            Phone number
            <div style={{ position: 'relative' }}>
              <Phone
                size={17}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '23px',
                  color: '#829693',
                }}
              />
              <input
                style={{ ...inputStyle, paddingLeft: '40px' }}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>
          </label>

          {message && (
            <p style={{ color: '#16845e', marginTop: '20px' }}>{message}</p>
          )}

          {error && (
            <p style={{ color: '#d64b42', marginTop: '20px' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              marginTop: '25px',
              padding: '13px 22px',
              border: 0,
              borderRadius: '9px',
              background: '#006D6F',
              color: '#fff',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            <Save size={17} />
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </main>
  );
}
