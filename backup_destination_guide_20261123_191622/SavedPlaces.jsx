import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Trash2, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'sushegad_saved_places';

function readSavedPlaces() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function SavedPlaces() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setPlaces(readSavedPlaces());
  }, []);

  function removePlace(placeId) {
    const updatedPlaces = places.filter(
      (place) => String(place._id || place.id) !== String(placeId)
    );

    setPlaces(updatedPlaces);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlaces));
  }

  function clearAll() {
    setPlaces([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <main style={{ padding: '55px 7%', minHeight: '65vh', color: '#183b3b' }}>
      <div style={{ maxWidth: '1100px', margin: 'auto' }}>
        <div style={{ color: '#FF6F61' }}>
          <Heart size={36} />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Saved Places
            </h1>
            <p style={{ color: '#637777' }}>
              Your personal collection of places to explore in Goa.
            </p>
          </div>

          {places.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                border: '1px solid #f0b8b2',
                background: '#fff',
                color: '#d64b42',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Clear all
            </button>
          )}
        </div>

        {places.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              marginTop: '30px',
              background: '#f2f8f6',
              borderRadius: '15px',
            }}
          >
            <Heart size={45} color="#FF6F61" />
            <h2>No saved places yet</h2>
            <p style={{ color: '#637777' }}>
              When you find a destination you love, save it here so you can
              come back to it later.
            </p>
            <Link
              to="/places"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px',
                background: '#006D6F',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Explore places <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '22px',
              marginTop: '30px',
            }}
          >
            {places.map((place) => {
              const id = place._id || place.id;
              const image =
                place.image ||
                place.imageUrl ||
                place.coverImage ||
                'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900';

              return (
                <article
                  key={id}
                  style={{
                    background: '#fff',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 22px rgba(0,0,0,.07)',
                  }}
                >
                  <img
                    src={image}
                    alt={place.name || 'Saved destination'}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '190px',
                      objectFit: 'cover',
                    }}
                  />

                  <div style={{ padding: '19px' }}>
                    <span
                      style={{
                        color: '#00877f',
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      {place.region || place.category || 'Goa'}
                    </span>

                    <h3 style={{ margin: '8px 0' }}>
                      {place.name || 'Saved destination'}
                    </h3>

                    <p style={{ color: '#637777', lineHeight: 1.6 }}>
                      {place.description || 'A destination saved for your next Goa trip.'}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '18px',
                      }}
                    >
                      <Link
                        to={`/places/${id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#006D6F',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        View place <ArrowRight size={16} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => removePlace(id)}
                        title="Remove saved place"
                        aria-label={`Remove ${place.name || 'place'} from saved places`}
                        style={{
                          border: 'none',
                          background: '#fff1ef',
                          color: '#d64b42',
                          borderRadius: '8px',
                          padding: '9px',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
