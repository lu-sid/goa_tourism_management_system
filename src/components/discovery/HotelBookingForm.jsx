import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  IndianRupee,
  CheckCircle2,
  LoaderCircle,
  Send,
  LockKeyhole
} from 'lucide-react';

import { createBooking } from '../../services/bookingService';
import useAuth from '../../hooks/useAuth';

function getLocalDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);

  return Math.max(0, Math.round((end - start) / 86400000));
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export default function HotelBookingForm({ hotel }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    specialRequests: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

  const nights = useMemo(
    () => calculateNights(form.checkIn, form.checkOut),
    [form.checkIn, form.checkOut]
  );

  const estimatedTotal = nights * Number(hotel?.pricePerNight || 0);

  const update = (field, value) => {
    setForm(previous => ({
      ...previous,
      [field]: value
    }));
    setError('');
    setBooking(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: {
            pathname: location.pathname
          }
        }
      });
      return;
    }

    if (!hotel?._id || hotel._id.startsWith('demo-')) {
      setError('This is a sample listing and cannot accept live bookings yet.');
      return;
    }

    if (!nights || nights < 1) {
      setError('Please select a valid check-in and check-out date.');
      return;
    }

    if (new Date(`${form.checkIn}T00:00:00`) < new Date(`${getLocalDateString()}T00:00:00`)) {
      setError('Check-in date cannot be in the past.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await createBooking({
        bookingType: 'Hotel',
        hotel: hotel._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        numberOfGuests: Number(form.guests),
        specialRequests: form.specialRequests.trim()
      });

      setBooking(response.data.booking);
      setForm({
        checkIn: '',
        checkOut: '',
        guests: '2',
        specialRequests: ''
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to submit your booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="hotel-booking-card">
      <div className="hotel-booking-heading">
        <span className="discovery-eyebrow dark">YOUR GOA GETAWAY</span>
        <h3>Book this stay</h3>
        <p>Choose your dates and send a booking request to the property.</p>
      </div>

      {booking ? (
        <div className="hotel-booking-success">
          <CheckCircle2 size={38} />
          <h3>Booking request submitted!</h3>
          <p>Your booking has been saved successfully.</p>

          <div className="hotel-booking-reference">
            <span>Booking reference</span>
            <strong>{booking.bookingId || booking._id}</strong>
          </div>

          <div className="hotel-booking-reference">
            <span>Current status</span>
            <strong>{booking.status || 'Pending'}</strong>
          </div>

          <p className="hotel-booking-note">
            Your booking is pending confirmation. It is not confirmed yet.
          </p>

          <Link to="/my-bookings" className="discovery-button">
            View my bookings
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="discovery-error">{error}</div>}

          <label className="hotel-booking-field">
            <span><CalendarDays size={16} /> Check-in date</span>
            <input
              type="date"
              required
              min={getLocalDateString()}
              value={form.checkIn}
              onChange={event => {
                update('checkIn', event.target.value);
                if (form.checkOut && event.target.value >= form.checkOut) {
                  setForm(previous => ({ ...previous, checkOut: '' }));
                }
              }}
            />
          </label>

          <label className="hotel-booking-field">
            <span><CalendarDays size={16} /> Check-out date</span>
            <input
              type="date"
              required
              min={form.checkIn || getLocalDateString()}
              value={form.checkOut}
              onChange={event => update('checkOut', event.target.value)}
            />
          </label>

          <label className="hotel-booking-field">
            <span><Users size={16} /> Number of guests</span>
            <select
              value={form.guests}
              onChange={event => update('guests', event.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(number => (
                <option key={number} value={number}>
                  {number} {number === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </label>

          <label className="hotel-booking-field">
            <span>Special requests (optional)</span>
            <textarea
              rows="3"
              value={form.specialRequests}
              onChange={event => update('specialRequests', event.target.value)}
              placeholder="Any preferences or additional requests?"
              maxLength={1000}
            />
          </label>

          <div className="hotel-booking-price">
            <div>
              <span>Price per night</span>
              <strong>{money(hotel?.pricePerNight)}</strong>
            </div>
            <div>
              <span>Number of nights</span>
              <strong>{nights}</strong>
            </div>
            <div className="hotel-booking-total">
              <span>Estimated total</span>
              <strong><IndianRupee size={17} />{estimatedTotal.toLocaleString('en-IN')}</strong>
            </div>
            <small>Final amount is calculated and validated by the server.</small>
          </div>

          <button
            className="discovery-button discovery-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting request...' : 'Request booking'}
            {submitting
              ? <LoaderCircle size={17} className="spin" />
              : <Send size={17} />}
          </button>

          {!isAuthenticated && (
            <p className="hotel-booking-login-note">
              <LockKeyhole size={15} />
              You will need to log in before submitting your request.
            </p>
          )}

          <p className="hotel-booking-note">
            This request will have Pending status until an administrator confirms it.
          </p>
        </form>
      )}
    </section>
  );
}

