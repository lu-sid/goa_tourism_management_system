import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Compass } from 'lucide-react';
import { getPackages } from '../../services/packageService';
import PackageGrid from '../../components/packages/PackageGrid';
import '../../styles/discovery.css';
import '../../styles/packages.css';

const categories = [
  'Adventure',
  'Beach',
  'Heritage',
  'Nature',
  'Family',
  'Honeymoon',
  'Other'
];

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPackages = async (filters = {}) => {
    setLoading(true);
    setError('');

    try {
      const response = await getPackages(filters);
      setPackages(response.data.packages || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to connect to the package service. Please try again.'
      );
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const filters = {};
    if (search.trim()) filters.search = search.trim();
    if (category) filters.category = category;
    if (minPrice !== '') filters.minPrice = minPrice;
    if (maxPrice !== '') filters.maxPrice = maxPrice;

    loadPackages(filters);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    loadPackages();
  };

  return (
    <main className="discovery-page">
      <section
        className="discovery-hero package-hero"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,39,40,.88), rgba(0,39,40,.25)), url('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1800')"
        }}
      >
        <div className="discovery-hero-content">
          <span className="discovery-eyebrow">EXPERIENCE THE SUSHEGAD LIFE</span>
          <h1>Discover Goa, your way.</h1>
          <p>
            From sunlit beaches and Portuguese heritage to lush nature
            escapes, find an experience worth remembering.
          </p>
        </div>
      </section>

      <section className="discovery-container">
        <div className="discovery-section-heading">
          <div>
            <span className="discovery-eyebrow dark">CURATED EXPERIENCES</span>
            <h2>Find your Goa getaway</h2>
            <p>Explore experiences designed around the things you love.</p>
          </div>

          <span className="discovery-count">
            {packages.length} experiences
          </span>
        </div>

        <form className="discovery-filter-panel package-filter-panel" onSubmit={handleSearch}>
          <div className="discovery-filter-field search-field">
            <label htmlFor="package-search">Search experiences</label>
            <div className="discovery-input-wrap">
              <Search size={17} />
              <input
                id="package-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try beaches, heritage, adventure..."
              />
            </div>
          </div>

          <div className="discovery-filter-field">
            <label htmlFor="package-category">Category</label>
            <select
              id="package-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="discovery-filter-field">
            <label htmlFor="package-min">Minimum price</label>
            <input
              id="package-min"
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="₹ Minimum"
            />
          </div>

          <div className="discovery-filter-field">
            <label htmlFor="package-max">Maximum price</label>
            <input
              id="package-max"
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="₹ Maximum"
            />
          </div>

          <button type="submit" className="discovery-button package-search-button">
            <SlidersHorizontal size={16} />
            Apply filters
          </button>

          <button type="button" className="discovery-reset" onClick={resetFilters}>
            Reset filters
          </button>
        </form>

        <PackageGrid
          packages={packages}
          loading={loading}
          error={error}
        />
      </section>

      <section className="discovery-bottom-cta">
        <Compass size={30} />
        <h2>Your next Goa story starts here.</h2>
        <p>Explore the coast, discover local culture and make the most of every day.</p>
      </section>
    </main>
  );
}
