import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Users } from 'lucide-react';

const fallbackImage =
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000';

export default function PackageCard({ tourPackage }) {
  const image = tourPackage.images?.[0] || fallbackImage;
  const days = tourPackage.duration?.days || 1;
  const nights = tourPackage.duration?.nights ?? Math.max(0, days - 1);

  return (
    <article className="discovery-card package-card">
      <Link
        to={`/packages/${tourPackage._id}`}
        className="discovery-card-image"
      >
        <img
          src={image}
          alt={tourPackage.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
        <span className="discovery-card-tag">
          {tourPackage.category || 'Goa Experience'}
        </span>
      </Link>

      <div className="discovery-card-body">
        <div className="discovery-card-top">
          <span className="discovery-location">
            <CalendarDays size={15} />
            {days} days · {nights} nights
          </span>
          <span className="discovery-rating">
            <Users size={15} />
            Up to {tourPackage.maxPeople || 1}
          </span>
        </div>

        <Link
          to={`/packages/${tourPackage._id}`}
          className="discovery-card-title"
        >
          {tourPackage.name}
        </Link>

        <p className="discovery-card-description">
          {tourPackage.description}
        </p>

        <div className="discovery-card-bottom">
          <div>
            <strong className="discovery-price">
              ₹{Number(tourPackage.price || 0).toLocaleString('en-IN')}
            </strong>
            <span className="discovery-price-label">/ person</span>
          </div>

          <Link
            to={`/packages/${tourPackage._id}`}
            className="discovery-arrow"
            aria-label={`View ${tourPackage.name}`}
          >
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}
