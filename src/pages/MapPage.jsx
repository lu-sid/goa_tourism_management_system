import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, MapPinned } from 'lucide-react';
import GoaMap from '../components/map/GoaMap';

export default function MapPage() {
  return (
    <main className="map-page">
      <section className="map-page-heading">
        <Link to="/" className="map-back-link">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="map-page-title-row">
          <div>
            <span className="map-eyebrow">YOUR GOA EXPLORATION GUIDE</span>
            <h1>Find your way around Goa.</h1>
            <p>
              From sunlit beaches to historic forts and hidden green escapes,
              discover the places that make Goa special.
            </p>
          </div>

          <div className="map-heading-icon">
            <MapPinned size={34} />
          </div>
        </div>

        <div className="map-page-note">
          <Compass size={17} />
          <span>Select a marker to discover a place and get directions.</span>
        </div>
      </section>

      <section className="map-page-content">
        <GoaMap showFilters />
      </section>
    </main>
  );
}
