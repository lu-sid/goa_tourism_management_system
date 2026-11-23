import React from 'react';
import { Compass, LoaderCircle } from 'lucide-react';
import PackageCard from './PackageCard';

export default function PackageGrid({ packages, loading, error }) {
  if (loading) {
    return (
      <div className="discovery-loading">
        <LoaderCircle size={30} className="spin" />
        <p>Finding experiences across Goa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discovery-empty">
        <Compass size={38} />
        <h3>We couldn't load the packages</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!packages.length) {
    return (
      <div className="discovery-empty">
        <Compass size={38} />
        <h3>No packages found</h3>
        <p>Try changing your search or selecting another category.</p>
      </div>
    );
  }

  return (
    <div className="discovery-grid">
      {packages.map((item) => (
        <PackageCard key={item._id} tourPackage={item} />
      ))}
    </div>
  );
}
