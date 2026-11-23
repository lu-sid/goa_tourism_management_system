import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Navigation,
  Compass,
  MapPinned,
  Heart,
  Clock,
  CalendarDays,
  Camera,
  Lightbulb,
  Hotel,
  Utensils,
  ExternalLink,
  Star,
  CheckCircle2,
} from 'lucide-react';

import {
  mapLocations,
  categoryColors,
} from '../../components/data/mapLocations';

import {
  destinationGuideData,
} from '../../components/data/destinationGuideData';

import { getHotels } from '../../services/hotelService';
import { getRestaurants } from '../../services/restaurantService';

const STORAGE_KEY = 'sushegad_saved_places';

function readSavedPlaces() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function extractList(response, possibleKeys) {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;

  for (const key of possibleKeys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  if (Array.isArray(data?.data)) return data.data;

  return [];
}

function mapsSearch(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function RecommendationCard({ item, type }) {
  const name = item.name || item.hotelName || item.restaurantName || 'Local recommendation';
  const location = item.location || item.address || item.region || '';
  const rating = item.rating || item.averageRating;
  const price = item.pricePerNight || item.price || item.averageCost;

  return (
    <article className="guide-recommendation-card">
      <div className="guide-recommendation-icon">
        {type === 'hotel' ? <Hotel size={22} /> : <Utensils size={22} />}
      </div>

      <div className="guide-recommendation-content">
        <h3>{name}</h3>
        {location && <p>{location}</p>}

        <div className="guide-recommendation-meta">
          {rating && (
            <span><Star size={14} /> {rating}</span>
          )}
          {price && <span>{price}</span>}
        </div>
      </div>

      <a
        href={mapsSearch(`${name} ${location} Goa`)}
        target="_blank"
        rel="noreferrer"
        aria-label={`Find ${name} on Google Maps`}
      >
        <ExternalLink size={17} />
      </a>
    </article>
  );
}

export default function PlaceDetailsPage() {
  const { id } = useParams();
  const place = mapLocations.find((item) => item.id === id);
  const guide = destinationGuideData[id] || {};

  const [saved, setSaved] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  useEffect(() => {
    if (!place) return;

    const existing = readSavedPlaces();
    setSaved(existing.some((item) => String(item.id || item._id) === String(place.id)));
  }, [place]);

  useEffect(() => {
    if (!place) return;

    let active = true;

    async function loadRecommendations() {
      setRecommendationsLoading(true);

      const [hotelResult, restaurantResult] = await Promise.allSettled([
        getHotels({ location: place.region }),
        getRestaurants({ location: place.region }),
      ]);

      if (!active) return;

      if (hotelResult.status === 'fulfilled') {
        setHotels(
          extractList(hotelResult.value, ['hotels', 'results'])
            .slice(0, 3)
        );
      }

      if (restaurantResult.status === 'fulfilled') {
        setRestaurants(
          extractList(restaurantResult.value, ['restaurants', 'results'])
            .slice(0, 3)
        );
      }

      setRecommendationsLoading(false);
    }

    loadRecommendations();

    return () => {
      active = false;
    };
  }, [place]);

  if (!place) {
    return (
      <main className="destination-details-page">
        <div className="destination-not-found">
          <Compass size={42} color="#006D6F" />
          <h1>Destination not found</h1>
          <p>We couldn't find this destination in our Goa guide.</p>
          <Link to="/map">Return to Explore Map</Link>
        </div>
      </main>
    );
  }

  const photos = guide.photos || [];
  const heroImage = photos[0] || 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1400';

  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  const hotelSearch = mapsSearch(`Hotels and resorts near ${place.name}, Goa`);
  const restaurantSearch = mapsSearch(`Restaurants near ${place.name}, Goa`);

  function toggleSaved() {
    const existing = readSavedPlaces();
    const alreadySaved = existing.some(
      (item) => String(item.id || item._id) === String(place.id)
    );

    let updated;

    if (alreadySaved) {
      updated = existing.filter(
        (item) => String(item.id || item._id) !== String(place.id)
      );
      setSaved(false);
    } else {
      const savedPlace = {
        id: place.id,
        name: place.name,
        category: place.category,
        region: place.region,
        description: place.description,
        image: heroImage,
      };

      updated = [...existing, savedPlace];
      setSaved(true);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return (
    <main className="destination-details-page">

      {/* HERO */}
      <section
        className="destination-guide-hero"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(8,35,35,.78), rgba(8,35,35,.18)), url("${heroImage}")` }}
      >
        <div className="destination-guide-hero-content">
          <Link to="/map" className="destination-back-link">
            <ArrowLeft size={17} />
            Back to Explore Map
          </Link>

          <span
            className="destination-category"
            style={{ color: '#FFC857' }}
          >
            {place.category} · {place.region}
          </span>

          <h1>{place.name}</h1>

          <p>
            <MapPin size={17} />
            {place.region}, Goa, India
          </p>

          <div className="destination-hero-actions">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="destination-directions-button"
            >
              <Navigation size={17} />
              Get directions
            </a>

            <button
              type="button"
              onClick={toggleSaved}
              className={`destination-save-button ${saved ? 'is-saved' : ''}`}
            >
              <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Saved to favourites' : 'Save this place'}
            </button>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="destination-guide-intro">
        <div>
          <span className="guide-eyebrow">DISCOVER GOA</span>
          <h2>Experience {place.name}</h2>
          <p>{place.description}</p>
        </div>

        <Link to="/map" className="guide-map-link">
          <MapPinned size={17} />
          Explore on map
        </Link>
      </section>

      {/* PHOTO GALLERY */}
      <section className="destination-guide-section">
        <div className="guide-section-heading">
          <div>
            <span className="guide-eyebrow">A GLIMPSE OF GOA</span>
            <h2>Photo gallery</h2>
          </div>
          <Camera size={25} color="#006D6F" />
        </div>

        <div className="destination-photo-gallery">
          {photos.map((photo, index) => (
            <a
              href={photo}
              target="_blank"
              rel="noreferrer"
              key={photo}
              className={index === 0 ? 'destination-photo-main' : ''}
            >
              <img
                src={photo}
                alt={`${place.name} travel photograph ${index + 1}`}
                loading="lazy"
              />
            </a>
          ))}
        </div>
        <p className="guide-photo-note">
          Illustrative travel photography. Images may not depict the exact destination.
        </p>
      </section>

      {/* VISIT INFORMATION */}
      <section className="destination-guide-section">
        <div className="guide-section-heading">
          <div>
            <span className="guide-eyebrow">PLAN YOUR VISIT</span>
            <h2>Before you go</h2>
          </div>
          <CalendarDays size={25} color="#006D6F" />
        </div>

        <div className="guide-visit-grid">
          <article className="guide-info-card">
            <CalendarDays size={24} />
            <span>Best time to visit</span>
            <strong>{guide.bestTime || 'Check seasonal conditions locally'}</strong>
          </article>

          <article className="guide-info-card">
            <Clock size={24} />
            <span>Suggested visit window</span>
            <strong>{guide.visitWindow || 'Check local visiting conditions'}</strong>
          </article>

          <article className="guide-info-card">
            <MapPin size={24} />
            <span>Entry information</span>
            <strong>{guide.entryInfo || 'Confirm current access and charges locally.'}</strong>
          </article>
        </div>

        <p className="guide-disclaimer">
          Timings, access rules, permits and fees can change. Confirm current information
          with the relevant local authority or attraction before travelling.
        </p>
      </section>

      {/* THINGS TO DO */}
      <section className="destination-guide-section guide-activities-section">
        <div className="guide-section-heading">
          <div>
            <span className="guide-eyebrow">MAKE THE MOST OF IT</span>
            <h2>Things to do</h2>
          </div>
          <Compass size={25} color="#006D6F" />
        </div>

        <div className="guide-activity-grid">
          {(guide.thingsToDo || []).map((activity, index) => (
            <article className="guide-activity-card" key={activity}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{activity}</p>
            </article>
          ))}
        </div>
      </section>

      {/* TRAVEL TIPS */}
      <section className="destination-guide-section">
        <div className="guide-section-heading">
          <div>
            <span className="guide-eyebrow">TRAVEL SMART</span>
            <h2>Useful travel tips</h2>
          </div>
          <Lightbulb size={25} color="#006D6F" />
        </div>

        <div className="guide-tips-list">
          {(guide.tips || []).map((tip) => (
            <div className="guide-tip" key={tip}>
              <CheckCircle2 size={19} />
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEARBY HOTELS */}
      <section className="destination-guide-section">
        <div className="guide-section-heading">
          <div>
            <span className="guide-eyebrow">STAY CLOSE BY</span>
            <h2>Nearby stays</h2>
            <p>Explore accommodation around {place.name}.</p>
          </div>
          <Hotel size={25} color="#006D6F" />
        </div>

        {recommendationsLoading ? (
          <p className="guide-loading">Finding nearby stays...</p>
        ) : hotels.length > 0 ? (
          <div className="guide-recommendation-grid">
            {hotels.map((hotel, index) => (
              <RecommendationCard
                key={hotel._id || hotel.id || index}
                item={hotel}
                type="hotel"
              />
            ))}
          </div>
        ) : (
          <div className="guide-discovery-card">
            <Hotel size={27} />
            <div>
              <h3>Find a stay near {place.name}</h3>
              <p>Explore hotels, resorts, guesthouses and homestays nearby.</p>
            </div>
            <a href={hotelSearch} target="_blank" rel="noreferrer">
              Find nearby stays <ExternalLink size={15} />
            </a>
          </div>
        )}
      </section>

      {/* NEARBY RESTAURANTS */}
      <section className="destination-guide-section">
        <div className="guide-section-heading">
          <div>
            <span className="guide-eyebrow">TASTE GOA</span>
            <h2>Nearby restaurants</h2>
            <p>Discover places to eat around {place.name}.</p>
          </div>
          <Utensils size={25} color="#006D6F" />
        </div>

        {recommendationsLoading ? (
          <p className="guide-loading">Finding nearby restaurants...</p>
        ) : restaurants.length > 0 ? (
          <div className="guide-recommendation-grid">
            {restaurants.map((restaurant, index) => (
              <RecommendationCard
                key={restaurant._id || restaurant.id || index}
                item={restaurant}
                type="restaurant"
              />
            ))}
          </div>
        ) : (
          <div className="guide-discovery-card">
            <Utensils size={27} />
            <div>
              <h3>Explore food near {place.name}</h3>
              <p>Find local restaurants, cafés and Goan food experiences.</p>
            </div>
            <a href={restaurantSearch} target="_blank" rel="noreferrer">
              Find restaurants <ExternalLink size={15} />
            </a>
          </div>
        )}
      </section>

      {/* LOCATION */}
      <section className="destination-guide-section destination-location-section">
        <div className="guide-section-heading">
          <div>
            <span className="guide-eyebrow">FIND YOUR WAY</span>
            <h2>Location details</h2>
          </div>
          <MapPinned size={25} color="#006D6F" />
        </div>

        <div className="destination-location-card">
          <div>
            <span>Latitude</span>
            <strong>{place.lat.toFixed(5)}</strong>
          </div>
          <div>
            <span>Longitude</span>
            <strong>{place.lng.toFixed(5)}</strong>
          </div>
          <a href={directionsUrl} target="_blank" rel="noreferrer">
            Open in Google Maps <ExternalLink size={16} />
          </a>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="destination-guide-cta">
        <div>
          <span>YOUR GOA JOURNEY</span>
          <h2>Keep exploring.</h2>
          <p>There is always another beautiful corner of Goa waiting to be discovered.</p>
        </div>

        <Link to="/map">
          Explore more destinations <ArrowRight size={17} />
        </Link>
      </section>

    </main>
  );
}
