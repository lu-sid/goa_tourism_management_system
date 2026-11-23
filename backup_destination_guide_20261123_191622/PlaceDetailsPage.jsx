import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Compass,
  MapPinned,
} from 'lucide-react';

import { mapLocations, categoryColors } from '../../components/data/mapLocations';

export default function PlaceDetailsPage() {
  const { id } = useParams();
  const place = mapLocations.find((item) => item.id === id);

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

  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  return (
    <main className="destination-details-page">
      <section className="destination-details-header">
        <Link to="/map" className="destination-back-link">
          <ArrowLeft size={17} />
          Back to Explore Map
        </Link>

        <span
          className="destination-category"
          style={{ color: categoryColors[place.category] || '#006D6F' }}
        >
          {place.category}
        </span>

        <h1>{place.name}</h1>

        <p className="destination-region">
          <MapPin size={17} />
          {place.region}, Goa
        </p>

        <p className="destination-description">{place.description}</p>

        <div className="destination-actions">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="destination-directions-button"
          >
            <Navigation size={17} />
            Get directions
          </a>

          <Link to="/map" className="destination-map-button">
            <MapPinned size={17} />
            Explore on map
          </Link>
        </div>
      </section>

      <section className="destination-information">
        <div className="destination-info-card">
          <MapPin size={23} color="#006D6F" />
          <span>Destination</span>
          <strong>{place.name}</strong>
        </div>
        <div className="destination-info-card">
          <Compass size={23} color="#006D6F" />
          <span>Category</span>
          <strong>{place.category}</strong>
        </div>
        <div className="destination-info-card">
          <MapPinned size={23} color="#006D6F" />
          <span>Region</span>
          <strong>{place.region}</strong>
        </div>
      </section>

      <section className="destination-coordinates">
        <h2>Location details</h2>
        <p>These coordinates identify the destination's mapped location.</p>

        <div className="destination-coordinate-values">
          <div>
            <span>Latitude</span>
            <strong>{place.lat.toFixed(5)}</strong>
          </div>
          <div>
            <span>Longitude</span>
            <strong>{place.lng.toFixed(5)}</strong>
          </div>
        </div>

        <a href={directionsUrl} target="_blank" rel="noreferrer">
          Open this location in Google Maps <ArrowLeft size={15} />
        </a>
      </section>
    </main>
  );
}
