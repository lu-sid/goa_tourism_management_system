import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  Navigation,
  Clock,
  CalendarDays,
  ArrowLeft,
  Compass,
  Heart
} from "lucide-react";

import { getPlaceById } from "../../services/placeService";
import PlaceDetailsPage from "./PlaceDetailsPage";

const STORAGE_KEY = "sushegad_saved_places";

function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function DatabasePlaceDetails({ place }) {
  const [saved, setSaved] = useState(false);

  const image =
    place.images?.[0] ||
    place.image ||
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1400";

  const address =
    typeof place.location === "string"
      ? place.location
      : place.location?.address || "Goa, India";

  const latitude = place.location?.latitude;
  const longitude = place.location?.longitude;

  const directionsUrl =
    latitude != null && longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${place.name}, ${address}, Goa`
        )}`;

  useEffect(() => {
    setSaved(
      readSaved().some(
        (item) => String(item.id || item._id) === String(place._id)
      )
    );
  }, [place._id]);

  function toggleSaved() {
    const current = readSaved();
    const exists = current.some(
      (item) => String(item.id || item._id) === String(place._id)
    );

    const updated = exists
      ? current.filter(
          (item) => String(item.id || item._id) !== String(place._id)
        )
      : [
          ...current,
          {
            id: place._id,
            name: place.name,
            category: place.category,
            region: address,
            description: place.description,
            image
          }
        ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(!exists);
  }

  return (
    <main className="database-destination-page">
      <section
        className="database-destination-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5,32,32,.82), rgba(5,32,32,.2)), url("${image}")`
        }}
      >
        <div className="database-destination-hero-content">
          <Link to="/places" className="database-destination-back">
            <ArrowLeft size={17} /> All destinations
          </Link>

          <span>{place.category || "GOA DESTINATION"}</span>
          <h1>{place.name}</h1>

          <p>
            <MapPin size={17} /> {address}
          </p>

          <div className="database-destination-actions">
            <a href={directionsUrl} target="_blank" rel="noreferrer">
              <Navigation size={17} /> Get directions
            </a>

            <button type="button" onClick={toggleSaved}>
              <Heart size={17} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save place"}
            </button>
          </div>
        </div>
      </section>

      <section className="database-destination-content">
        <span className="places-discovery-kicker">DISCOVER GOA</span>
        <h2>Experience {place.name}</h2>
        <p className="database-destination-description">
          {place.description}
        </p>

        <div className="database-destination-info-grid">
          <article>
            <CalendarDays size={23} />
            <span>Best time to visit</span>
            <strong>
              {place.bestTimeToVisit || "Check seasonal conditions locally"}
            </strong>
          </article>

          <article>
            <Clock size={23} />
            <span>Opening hours</span>
            <strong>
              {place.openingTime || place.closingTime
                ? `${place.openingTime || "Check locally"} – ${place.closingTime || "Check locally"}`
                : "Confirm locally before visiting"}
            </strong>
          </article>

          <article>
            <MapPin size={23} />
            <span>Entry fee</span>
            <strong>
              {Number(place.entryFee || 0) === 0
                ? "No fee listed"
                : `₹${Number(place.entryFee).toLocaleString("en-IN")}`}
            </strong>
          </article>
        </div>

        <div className="database-destination-location">
          <div>
            <Compass size={23} />
            <h3>Find your way</h3>
            <p>{address}, Goa, India</p>
          </div>

          <a href={directionsUrl} target="_blank" rel="noreferrer">
            Open directions <Navigation size={16} />
          </a>
        </div>

        <p className="database-destination-note">
          Visiting information may change. Confirm access, opening hours
          and fees with local authorities before travelling.
        </p>
      </section>
    </main>
  );
}

export default function DestinationDetailsRouter() {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function loadPlace() {
      setStatus("loading");
      setPlace(null);

      try {
        const response = await getPlaceById(id);
        const data = response?.data ?? response;
        const result = data?.place || data;

        if (active && result && (result._id || result.name)) {
          setPlace(result);
          setStatus("found");
        } else if (active) {
          setStatus("static");
        }
      } catch (error) {
        if (active) {
          const code = error?.response?.status;

          // Existing static map destinations use their own IDs.
          setStatus(code === 404 ? "static" : "static");
        }
      }
    }

    loadPlace();

    return () => {
      active = false;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <main className="places-state">
        <div className="places-loading-spinner" />
        <p>Loading destination...</p>
      </main>
    );
  }

  if (status === "found" && place) {
    return <DatabasePlaceDetails place={place} />;
  }

  return <PlaceDetailsPage />;
}
