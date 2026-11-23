import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Minus,
  Plus,
  Send,
  Users,
  XCircle
} from 'lucide-react';

import { getPackageById } from '../../services/packageService';
import { createBooking } from '../../services/bookingService';
import useAuth from '../../hooks/useAuth';

import '../../styles/discovery.css';
import '../../styles/packages.css';

const fallbackImage =
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1400';

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export default function PackageDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [tourPackage, setTourPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadPackage() {
      setLoading(true);
      setError('');

      try {
        const response = await getPackageById(id);
        if (active) setTourPackage(response.data.tourPackage);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
            'Unable to load this package.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPackage();
    return () => { active = false; };
  }, [id]);

  const maxPeople = Number(tourPackage?.maxPeople || 1);
  const price = Number(tourPackage?.price || 0);
  const estimatedTotal = price * guests;

  const handleBooking = async (event) => {
    event.preventDefault();
    setBookingError('');
    setSuccess(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/packages/${id}` } });
      return;
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > maxPeople) {
      setBookingError(`Choose between 1 and ${maxPeople} guests.`);
      return;
    }

    setSubmitting(true);

    try {
      const response = await createBooking({
        bookingType: 'TourPackage',
        tourPackage: tourPackage._id,
        numberOfGuests: guests,
        specialRequests
      });

      setSuccess(response.data.booking);
      setSpecialRequests('');
    } catch (err) {
      setBookingError(
        err.response?.data?.message ||
        'Unable to submit your booking request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="discovery-page detail-loading discovery-loading">
        <LoaderCircle size={32} className="spin" />
        Loading experience...
      </main>
    );
  }

  if (error || !tourPackage) {
    return (
      <main className="discovery-page detail-empty discovery-empty">
        <XCircle size={40} />
        <h2>Experience unavailable</h2>
        <p>{error || 'This package could not be found.'}</p>
        <Link className="discovery-button" to="/packages">Browse packages</Link>
      </main>
    );
  }

  const images = tourPackage.images?.length
    ? tourPackage.images
    : [fallbackImage];

  return (
    <main className="discovery-detail-page package-detail-page">
      <div className="discovery-detail-top">
        <button
          type="button"
          className="discovery-back"
          onClick={() => navigate('/packages')}
        >
          <ArrowLeft size={17} /> All experiences
        </button>
        <span>GOA EXPERIENCES</span>
      </div>

      <section className="discovery-detail-hero package-detail-hero">
        <img
          src={images[0]}
          alt={tourPackage.name}
          onError={(event) => { event.currentTarget.src = fallbackImage; }}
        />
        <div className="discovery-detail-overlay">
          <span className="discovery-eyebrow">{tourPackage.category}</span>
          <h1>{tourPackage.name}</h1>
          <p><MapPin size={17} /> Discover Goa with Sushegad Goa</p>
        </div>
      </section>

      <div className="discovery-detail-layout">
        <div>
          <section className="discovery-detail-section">
            <span className="discovery-eyebrow dark">THE EXPERIENCE</span>
            <h2>About this journey</h2>
            <p>{tourPackage.description}</p>

            <div className="package-facts">
              <span><CalendarDays size={18} /> {tourPackage.duration?.days || 1} days</span>
              <span><Clock size={18} /> {tourPackage.duration?.nights || 0} nights</span>
              <span><Users size={18} /> Up to {maxPeople} people</span>
            </div>
          </section>

          {tourPackage.itinerary?.length > 0 && (
            <section className="discovery-detail-section">
              <span className="discovery-eyebrow dark">YOUR JOURNEY</span>
              <h2>Day-wise itinerary</h2>

              <div className="package-itinerary">
                {tourPackage.itinerary.map((day, index) => (
                  <article className="package-itinerary-day" key={`${day.day}-${index}`}>
                    <div className="package-day-number">
                      DAY {day.day || index + 1}
                    </div>
                    <div>
                      <h3>{day.title || `Day ${index + 1}`}</h3>
                      <ul>
                        {(day.activities || []).map((activity, activityIndex) => (
                          <li key={activityIndex}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {tourPackage.destinations?.length > 0 && (
            <section className="discovery-detail-section">
              <span className="discovery-eyebrow dark">PLACES YOU MAY VISIT</span>
              <h2>Destinations</h2>
              <div className="package-destinations">
                {tourPackage.destinations.map((place) => (
                  <Link to={`/places/${place._id}`} key={place._id}>
                    <MapPin size={16} />
                    {place.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="package-inclusion-grid">
            <section className="discovery-detail-section">
              <h2><CheckCircle2 size={21} /> What's included</h2>
              {tourPackage.inclusions?.length ? (
                <ul className="package-check-list">
                  {tourPackage.inclusions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : <p>Inclusions will be provided by the package administrator.</p>}
            </section>

            <section className="discovery-detail-section">
              <h2><XCircle size={21} /> Not included</h2>
              {tourPackage.exclusions?.length ? (
                <ul className="package-exclusion-list">
                  {tourPackage.exclusions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : <p>Check with the administrator for exclusions.</p>}
            </section>
          </div>

          {images.length > 1 && (
            <section className="discovery-detail-section">
              <h2>More glimpses</h2>
              <div className="discovery-gallery">
                {images.slice(1).map((image, index) => (
                  <a href={image} target="_blank" rel="noreferrer" key={index}>
                    <img src={image} alt={`${tourPackage.name} view ${index + 2}`} loading="lazy" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="discovery-detail-sidebar">
          <section className="discovery-price-card">
            <span>Starting from</span>
            <strong>{money(price)}</strong>
            <small>per person · Package price</small>
            <div className="discovery-price-divider" />
            <div className="discovery-sidebar-info">
              <span><CalendarDays size={17} /> {tourPackage.duration?.days || 1} days / {tourPackage.duration?.nights || 0} nights</span>
              <span><Users size={17} /> Maximum {maxPeople} guests</span>
              <span><Compass size={17} /> {tourPackage.category}</span>
            </div>
          </section>

          <form className="discovery-enquiry-form package-booking-form" onSubmit={handleBooking}>
            <div className="discovery-form-heading">
              <span className="discovery-eyebrow dark">PLAN YOUR GETAWAY</span>
              <h3>Request this experience</h3>
              <p>Submit your request and our administrator can review it.</p>
            </div>

            {bookingError && <div className="discovery-error">{bookingError}</div>}

            {success ? (
              <div className="package-booking-success">
                <CheckCircle2 size={30} />
                <h3>Request submitted!</h3>
                <p>Your booking is currently Pending confirmation.</p>
                <strong>{success.bookingId}</strong>
                <p>Estimated total: {money(success.totalAmount)}</p>
                <Link to="/my-bookings" className="discovery-button">
                  View my bookings
                </Link>
              </div>
            ) : (
              <>
                <label>
                  Number of guests
                  <div className="package-guest-control">
                    <button
                      type="button"
                      disabled={guests <= 1}
                      onClick={() => setGuests((value) => Math.max(1, value - 1))}
                      aria-label="Decrease guests"
                    >
                      <Minus size={16} />
                    </button>
                    <strong>{guests}</strong>
                    <button
                      type="button"
                      disabled={guests >= maxPeople}
                      onClick={() => setGuests((value) => Math.min(maxPeople, value + 1))}
                      aria-label="Increase guests"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </label>

                <label className="discovery-message-label">
                  Special requests
                  <textarea
                    rows="4"
                    maxLength="1000"
                    value={specialRequests}
                    onChange={(event) => setSpecialRequests(event.target.value)}
                    placeholder="Tell us about preferences or requirements..."
                  />
                </label>

                <div className="package-total">
                  <span>Estimated total</span>
                  <strong>{money(estimatedTotal)}</strong>
                  <small>{money(price)} × {guests} guests</small>
                </div>

                <button
                  className="discovery-button discovery-submit"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting
                    ? <><LoaderCircle size={17} className="spin" /> Submitting...</>
                    : <><Send size={17} /> Request booking</>}
                </button>

                {!isAuthenticated && (
                  <p className="discovery-form-note">
                    <LockKeyhole size={14} /> You will need to sign in before submitting.
                  </p>
                )}

                <p className="discovery-form-note">
                  No payment is collected here. Your request remains Pending until reviewed.
                </p>
              </>
            )}
          </form>
        </aside>
      </div>
    </main>
  );
}
