import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Clock, Ticket } from 'lucide-react';
import { getMyBookings } from '../../services/bookingService';

function formatDate(date) {
  if (!date) return 'Date not specified';

  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getStatusColor(status) {
  const value = (status || '').toLowerCase();

  if (value === 'confirmed' || value === 'completed') return '#16845e';
  if (value === 'cancelled') return '#d64b42';
  if (value === 'pending') return '#b7791f';

  return '#006D6F';
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBookings() {
      try {
        const response = await getMyBookings();
        const data = response?.data?.bookings || response?.data || [];

        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load your bookings. Please log in and try again.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  return (
    <main style={{ padding: '55px 7%', minHeight: '65vh', color: '#183b3b' }}>
      <div style={{ maxWidth: '1050px', margin: 'auto' }}>
        <div style={{ color: '#00877f' }}>
          <Ticket size={35} />
        </div>

        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          My Bookings
        </h1>

        <p style={{ color: '#637777', lineHeight: 1.7 }}>
          Keep track of your trips and booking details.
        </p>

        {loading && <p style={{ marginTop: '30px' }}>Loading your bookings...</p>}

        {error && (
          <p style={{ color: '#d64b42', marginTop: '25px' }}>{error}</p>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              background: '#f2f8f6',
              borderRadius: '15px',
              padding: '55px 20px',
              marginTop: '30px',
            }}
          >
            <CalendarDays size={42} color="#00877f" />
            <h2>No bookings yet</h2>
            <p style={{ color: '#637777' }}>
              Your bookings will appear here once you make a reservation.
            </p>
            <Link
              to="/packages"
              style={{
                display: 'inline-block',
                marginTop: '12px',
                background: '#006D6F',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Explore packages
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gap: '18px', marginTop: '30px' }}>
          {bookings.map((booking) => {
            const status = booking.status || 'Pending';
            const itemName =
              booking.package?.name ||
              booking.hotel?.name ||
              booking.place?.name ||
              booking.packageName ||
              booking.hotelName ||
              'Goa booking';

            return (
              <article
                key={booking._id || booking.bookingId}
                style={{
                  background: '#fff',
                  borderRadius: '13px',
                  padding: '23px',
                  boxShadow: '0 4px 20px rgba(0,0,0,.06)',
                  border: '1px solid #e7efec',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <span style={{ color: '#00877f', fontSize: '13px', fontWeight: 700 }}>
                      BOOKING
                    </span>
                    <h3 style={{ margin: '7px 0' }}>{itemName}</h3>
                    <small style={{ color: '#829693' }}>
                      Reference: {booking.bookingId || booking._id || 'N/A'}
                    </small>
                  </div>

                  <span
                    style={{
                      background: `${getStatusColor(status)}18`,
                      color: getStatusColor(status),
                      padding: '7px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 700,
                    }}
                  >
                    {status}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '22px',
                    marginTop: '22px',
                    color: '#637777',
                    fontSize: '14px',
                  }}
                >
                  <span style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                    <CalendarDays size={17} />
                    {formatDate(booking.bookingDate || booking.startDate || booking.date)}
                  </span>

                  {booking.location && (
                    <span style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                      <MapPin size={17} />
                      {booking.location}
                    </span>
                  )}

                  {booking.bookingTime && (
                    <span style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                      <Clock size={17} />
                      {booking.bookingTime}
                    </span>
                  )}
                </div>

                {booking.totalAmount != null && (
                  <p style={{ marginBottom: 0, fontWeight: 700 }}>
                    Total: â‚¹{Number(booking.totalAmount).toLocaleString('en-IN')}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
