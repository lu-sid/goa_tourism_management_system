import React from 'react';
import { LocateFixed, MapPin } from 'lucide-react';

export default function MapControls({
  categories,
  activeCategory,
  onCategoryChange,
  onLocate,
  locating,
  locationError,
}) {
  return (
    <div className="map-controls">
      <div className="map-filter-heading">
        <div>
          <span className="map-eyebrow">DISCOVER GOA</span>
          <h2>Explore places</h2>
        </div>
        <MapPin size={23} color="#006D6F" />
      </div>

      <div className="map-category-list">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={`map-category-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="map-location-button"
        onClick={onLocate}
        disabled={locating}
      >
        <LocateFixed size={17} />
        {locating ? 'Finding your location…' : 'Use my location'}
      </button>

      {locationError && (
        <p className="map-location-error" role="status">
          {locationError}
        </p>
      )}
    </div>
  );
}
