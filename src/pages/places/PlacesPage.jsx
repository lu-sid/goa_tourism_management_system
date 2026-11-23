import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Compass,
  ArrowRight,
  SlidersHorizontal,
  X,
  Map,
  RefreshCw
} from "lucide-react";

import { getPlaces } from "../../services/placeService";

const categories = [
  "All",
  "Beach",
  "Historical",
  "Religious",
  "Nature",
  "Adventure",
  "Other"
];

const fallbackImage =
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1000";

function getImage(place) {
  return (
    place.images?.[0] ||
    place.image ||
    place.imageUrl ||
    place.coverImage ||
    fallbackImage
  );
}

function getRegion(place) {
  if (typeof place.location === "string") return place.location;
  return (
    place.location?.address ||
    place.region ||
    "Goa, India"
  );
}

function extractPlaces(response) {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.places)) return data.places;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

export default function PlacesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";

  useEffect(() => {
    let active = true;

    async function loadPlaces() {
      setLoading(true);
      setError("");

      try {
        const response = await getPlaces();
        const results = extractPlaces(response);

        if (active) setPlaces(results);
      } catch (err) {
        if (active) {
          setError(
            err?.response?.data?.message ||
            "We couldn't load destinations. Please check your connection and try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPlaces();

    return () => {
      active = false;
    };
  }, []);

  const filteredPlaces = useMemo(() => {
    const term = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesCategory =
        category === "All" || place.category === category;

      const searchableText = [
        place.name,
        place.description,
        getRegion(place),
        place.category
      ].join(" ").toLowerCase();

      return matchesCategory && searchableText.includes(term);
    });
  }, [places, search, category]);

  function updateSearch(value) {
    const next = new URLSearchParams(searchParams);

    if (value) next.set("search", value);
    else next.delete("search");

    setSearchParams(next, { replace: true });
  }

  function updateCategory(value) {
    const next = new URLSearchParams(searchParams);

    if (value === "All") next.delete("category");
    else next.set("category", value);

    setSearchParams(next, { replace: true });
  }

  return (
    <main className="places-discovery-page">
      <section className="places-discovery-hero">
        <div className="places-discovery-hero-inner">
          <span className="places-discovery-eyebrow">
            <Compass size={15} /> THE SUSHEGAD GUIDE
          </span>

          <h1>Find your corner of Goa.</h1>

          <p>
            From quiet coastlines to old-world architecture,
            discover places that make Goa unforgettable.
          </p>

          <div className="places-search-box">
            <Search size={20} />

            <input
              type="search"
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search beaches, forts, waterfalls..."
              aria-label="Search destinations"
            />

            {search && (
              <button
                type="button"
                onClick={() => updateSearch("")}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="places-discovery-content">
        <div className="places-discovery-heading">
          <div>
            <span className="places-discovery-kicker">
              EXPLORE THE STATE
            </span>
            <h2>Discover destinations</h2>
            <p>Choose a place to start your next Goa experience.</p>
          </div>

          <Link to="/map" className="places-map-link">
            <Map size={17} />
            Explore map
          </Link>
        </div>

        <div className="places-filter-heading">
          <SlidersHorizontal size={17} />
          <span>Explore by category</span>
        </div>

        <div className="places-category-filters">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "active" : ""}
              onClick={() => updateCategory(item)}
            >
              {item === "All" ? "All places" : item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="places-state">
            <div className="places-loading-spinner" />
            <p>Finding beautiful places in Goa...</p>
          </div>
        ) : error ? (
          <div className="places-state places-error-state">
            <Compass size={35} />
            <h3>Destinations unavailable</h3>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} /> Try again
            </button>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="places-state">
            <Search size={35} />
            <h3>No destinations found</h3>
            <p>Try another search term or category.</p>
            <button
              type="button"
              onClick={() => {
                setSearchParams({});
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="places-results-count">
              Showing {filteredPlaces.length}{" "}
              {filteredPlaces.length === 1 ? "destination" : "destinations"}
            </div>

            <div className="places-discovery-grid">
              {filteredPlaces.map((place) => (
                <article
                  className="places-discovery-card"
                  key={place._id || place.id || place.name}
                >
                  <Link
                    to={`/places/${place._id || place.id}`}
                    className="places-discovery-image-link"
                  >
                    <img
                      src={getImage(place)}
                      alt={place.name}
                      loading="lazy"
                    />

                    <span className="places-card-category">
                      {place.category || "Goa"}
                    </span>
                  </Link>

                  <div className="places-discovery-card-body">
                    <span className="places-card-location">
                      <MapPin size={14} />
                      {getRegion(place)}
                    </span>

                    <h3>{place.name}</h3>

                    <p>
                      {place.description ||
                        "Discover this destination and add it to your Goa itinerary."}
                    </p>

                    <Link
                      to={`/places/${place._id || place.id}`}
                      className="places-discovery-card-link"
                    >
                      Explore destination <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

