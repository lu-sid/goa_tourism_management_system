import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Ticket,
  Users,
  Hotel,
  Package,
  XCircle,
  LoaderCircle
} from 'lucide-react';

import {
  getMyBookings,
  cancelBooking
} from '../../services/bookingService';

function formatDate(date) {
  if (!date) return 'Not specified';

  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function getStatusColor(status) {
  switch ((status || '').toLowerCase()) {
    case 'confirmed':
    case 'completed':
      return '#16845e';
    case 'cancelled':
      return '#d64b42';
    case 'pending':
      return '#b7791f';
    default:
      return '#006D6F';
  }
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState('');

  const loadBookings = async () => {
    setError('');

    try {
      const response = await getMyBookings();
      setBookings(response?.data?.bookings || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load your bookings. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (booking) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel booking ${booking.bookingId || ''}?`
    );

    if (!confirmed) return;

    setCancellingId(booking._id);
    setError('');

    try {
      await cancelBooking(booking._id);
      await loadBookings();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to cancel this booking.'
      );
    } finally {
      setCancellingId('');
    }
  };

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
          Keep track of your stays, trips and booking requests.
        </p>

        {error && (
          <div style={{
            background: '#fff1ef',
            color: '#bd4037',
            padding: '13px 16px',
            borderRadius: '9px',
            marginTop: '20px'
          }}>
            {error}
          </div>
        )}

        {loading && (
          <p style={{ marginTop: '30px' }}>
            <LoaderCircle size={18} /> Loading your bookings...
          </p>
        )}

        {!loading && bookings.length === 0 && (
          <div style={{
            textAlign: 'center',
            background: '#f2f8f6',
            borderRadius: '15px',
            padding: '55px 20px',
            marginTop: '30px'
          }}>
            <CalendarDays size={42} color="#00877f" />
            <h2>No bookings yet</h2>
            <p style={{ color: '#637777' }}>
              Your booking requests will appear here once you submit one.
            </p>
            <Link
              to="/hotels"
              style={{
                display: 'inline-block',
                marginTop: '12px',
                background: '#006D6F',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700
              }}
            >
              Explore stays
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gap: '18px', marginTop: '30px' }}>
          {bookings.map(booking => {
            const status = booking.status || 'Pending';
            const isHotel = booking.bookingType === 'Hotel';
            const item = booking.hotel || booking.tourPackage;
            const itemName = item?.name || (isHotel ? 'Hotel booking' : 'Tour package');
            const address = item?.location?.address || item?.location?.city || '';

            const canCancel = !['Cancelled', 'Completed'].includes(status);

            return (
              <article
                key={booking._id || booking.bookingId}
                style={{
                  background: '#fff',
                  borderRadius: '13px',
                  padding: '23px',
                  boxShadow: '0 4px 20px rgba(0,0,0,.06)',
                  border: '1px solid #e7efec'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <span style={{
                      color: '#00877f',
                      fontSize: '13px',
                      fontWeight: 700
                    }}>
                      {isHotel ? 'HOTEL BOOKING' : 'TOUR PACKAGE'}
                    </span>

                    <h3 style={{ margin: '7px 0' }}>{itemName}</h3>

                    <small style={{ color: '#829693' }}>
                      Reference: {booking.bookingId || booking._id || 'N/A'}
                    </small>
                  </div>

                  <span style={{
                    background: `${getStatusColor(status)}18`,
                    color: getStatusColor(status),
                    padding: '7px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 700
                  }}>
                    {status}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '22px',
                  marginTop: '22px',
                  color: '#637777',
                  fontSize: '14px'
                }}>
                  <span style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                    <CalendarDays size={17} />
                    Booked: {formatDate(booking.bookingDate || booking.createdAt)}
                  </span>

                  {isHotel && (
                    <>
                      <span style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                        <CalendarDays size={17} />
                        Check-in: {formatDate(booking.checkIn)}
                      </span>
                      <span style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                        <CalendarDays size={17} />
                        Check-out: {formatDate(booking.checkOut)}
                      </span>
                    </>
                  )}

                  <span style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                    <Users size={17} />
                    {booking.numberOfGuests} guests
                  </span>

                  {address && (
                    <span style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                      <MapPin size={17} />
                      {address}
                    </span>
                  )}

                  <span style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                    {isHotel ? <Hotel size={17} /> : <Package size={17} />}
                    {booking.bookingType}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #edf1ef'
                }}>
                  <div>
                    <small style={{ color: '#829693' }}>Total amount</small>
                    <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: '19px' }}>
                      {money(booking.totalAmount)}
                    </p>
                  </div>

                  {canCancel && (
                    <button
                      type="button"
                      disabled={cancellingId === booking._id}
                      onClick={() => handleCancel(booking)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid #e8aaa5',
                        color: '#c44840',
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        fontWeight: 700
                      }}
                    >
                      {cancellingId === booking._id
                        ? <LoaderCircle size={16} />
                        : <XCircle size={16} />}
                      Cancel booking
                    </button>
                  )}
                </div>

                {booking.specialRequests && (
                  <p style={{
                    color: '#637777',
                    background: '#f7faf9',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '15px',
                    fontSize: '14px'
                  }}>
                    <strong>Special requests:</strong> {booking.specialRequests}
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
