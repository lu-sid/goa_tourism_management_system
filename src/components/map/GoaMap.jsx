import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  mapLocations,
  mapCategories,
  categoryColors,
} from '../data/mapLocations';
import MapControls from './MapControls';

function createMarkerIcon(category) {
  const color = categoryColors[category] || '#006D6F';

  return L.divIcon({
    className: 'sushegad-marker-wrapper',
    html: `<div class="sushegad-marker" style="--marker-color:${color}"><span></span></div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 32],
    popupAnchor: [0, -30],
  });
}

function FlyToLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, { duration: 1.4 });
    }
  }, [position, map]);

  return null;
}

export default function GoaMap({ compact = false, showFilters = true }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [userPosition, setUserPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const visibleLocations = useMemo(() => {
    if (activeCategory === 'All') return mapLocations;
    return mapLocations.filter(
      (place) => place.category === activeCategory
    );
  }, [activeCategory]);

  function locateUser() {
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Your browser does not support location services.');
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);
        setLocating(false);
      },
      (error) => {
        const messages = {
          1: 'Location permission was denied. Allow location access in your browser settings.',
          2: 'Your current location could not be determined. Please try again.',
          3: 'Location request timed out. Please try again.',
        };

        setLocationError(
          messages[error.code] || 'Unable to retrieve your location.'
        );
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  }

  return (
    <div className={`goa-map-layout ${compact ? 'compact' : ''}`}>
      {showFilters && (
        <MapControls
          categories={mapCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onLocate={locateUser}
          locating={locating}
          locationError={locationError}
        />
      )}

      <div className="goa-map-container">
        <MapContainer
          center={[15.35, 74.05]}
          zoom={9}
          scrollWheelZoom
          className="goa-leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToLocation position={userPosition} />

          {visibleLocations.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createMarkerIcon(place.category)}
            >
              <Popup>
                <div className="map-popup">
                  <span
                    className="map-popup-category"
                    style={{
                      color: categoryColors[place.category] || '#006D6F',
                    }}
                  >
                    {place.category} · {place.region}
                  </span>

                  <h3>{place.name}</h3>
                  <p>{place.description}</p>

                  <Link
                    to={`/places/${place.id}`}
                    className="map-discover-link"
                  >
                    Discover destination
                  </Link>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="map-directions-link"
                  >
                    <Navigation size={15} />
                    Get directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}

          {userPosition && (
            <CircleMarker
              center={userPosition}
              radius={9}
              pathOptions={{
                color: '#ffffff',
                weight: 3,
                fillColor: '#1687ff',
                fillOpacity: 1,
              }}
            >
              <Popup>
                <strong><MapPin size={14} /> Your current location</strong>
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>

        <div className="map-place-count">
          {visibleLocations.length} places shown
        </div>
      </div>
    </div>
  );
}

