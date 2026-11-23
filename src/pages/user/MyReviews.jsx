import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquareText } from 'lucide-react';
import { getMyReviews } from '../../services/reviewService';

function formatDate(date) {
  if (!date) return 'Recently';

  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ReviewStars({ rating }) {
  const value = Math.min(5, Math.max(0, Number(rating) || 0));

  return (
    <div style={{ display: 'flex', gap: '3px' }} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={17}
          fill={star <= value ? '#FFC857' : 'none'}
          color={star <= value ? '#D69A22' : '#cbd5d1'}
        />
      ))}
    </div>
  );
}

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await getMyReviews();
        const data = response?.data?.reviews || response?.data || [];

        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load your reviews. Please log in and try again.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  return (
    <main style={{ padding: '55px 7%', minHeight: '65vh', color: '#183b3b' }}>
      <div style={{ maxWidth: '950px', margin: 'auto' }}>
        <div style={{ color: '#00877f' }}>
          <MessageSquareText size={35} />
        </div>

        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          My Reviews
        </h1>

        <p style={{ color: '#637777', lineHeight: 1.7 }}>
          Your feedback and experiences shared with the Sushegad Goa community.
        </p>

        {loading && <p style={{ marginTop: '30px' }}>Loading your reviews...</p>}

        {error && (
          <p style={{ color: '#d64b42', marginTop: '25px' }}>{error}</p>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '55px 20px',
              marginTop: '30px',
              background: '#f2f8f6',
              borderRadius: '15px',
            }}
          >
            <Star size={42} color="#00877f" />
            <h2>No reviews yet</h2>
            <p style={{ color: '#637777' }}>
              After visiting a place or trying an experience, you can share
              your feedback here.
            </p>
            <Link
              to="/places"
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
              Explore destinations
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gap: '18px', marginTop: '30px' }}>
          {reviews.map((review) => (
            <article
              key={review._id}
              style={{
                padding: '24px',
                background: '#fff',
                border: '1px solid #e7efec',
                borderRadius: '13px',
                boxShadow: '0 4px 20px rgba(0,0,0,.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {review.place?.name ||
                    review.hotel?.name ||
                    review.restaurant?.name ||
                    review.targetName ||
                    'Your review'}
                </h3>

                <ReviewStars rating={review.rating} />
              </div>

              <p style={{ color: '#637777', lineHeight: 1.8 }}>
                {review.comment || review.review || 'No written comment provided.'}
              </p>

              <small style={{ color: '#829693' }}>
                Posted on {formatDate(review.createdAt || review.date)}
              </small>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
