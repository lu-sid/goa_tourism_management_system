import React, { useEffect, useMemo, useState } from 'react';
import {
  Link,
  useParams,
  useNavigate
} from 'react-router-dom';

import {
  MapPin,
  Star,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  CalendarDays,
  Users,
  Clock,
  Wifi,
  Coffee,
  Waves,
  Utensils,
  CheckCircle2,
  Send,
  BedDouble,
  Heart,
  LoaderCircle,
  Sparkles
} from 'lucide-react';

import { getHotels, getHotelById } from '../../services/hotelService';
import {
  getRestaurants,
  getRestaurantById
} from '../../services/restaurantService';
import { submitFeedback } from '../../services/feedbackService';

const hotelSamples = [
  {
    _id: 'demo-hotel-1',
    name: 'The Coastal Retreat',
    description: 'A peaceful coastal escape with tropical gardens, beautiful interiors and a relaxing atmosphere.',
    category: 'Resort',
    location: { city: 'Candolim', address: 'Candolim Beach Road, Candolim, Goa' },
    pricePerNight: 4500,
    rating: 4.8,
    amenities: ['Swimming Pool', 'Free Wi-Fi', 'Restaurant', 'Beach Access'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200'],
    contactNumber: '',
    email: ''
  },
  {
    _id: 'demo-hotel-2',
    name: 'Casa Verde Boutique Stay',
    description: 'A charming boutique property inspired by Portuguese architecture and Goan hospitality.',
    category: 'Homestay',
    location: { city: 'Assagao', address: 'Assagao, North Goa' },
    pricePerNight: 3200,
    rating: 4.7,
    amenities: ['Garden', 'Free Wi-Fi', 'Breakfast', 'Parking'],
    images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200'],
    contactNumber: '',
    email: ''
  },
  {
    _id: 'demo-hotel-3',
    name: 'Palm Shore Resort',
    description: 'A tropical resort experience with spacious rooms and easy access to the beach.',
    category: 'Luxury',
    location: { city: 'Palolem', address: 'Palolem Beach, Canacona, Goa' },
    pricePerNight: 6500,
    rating: 4.9,
    amenities: ['Pool', 'Spa', 'Restaurant', 'Beach View'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'],
    contactNumber: '',
    email: ''
  },
  {
    _id: 'demo-hotel-4',
    name: 'The Goan Courtyard',
    description: 'An affordable and comfortable stay surrounded by greenery and local culture.',
    category: 'Budget',
    location: { city: 'Margao', address: 'Margao, South Goa' },
    pricePerNight: 1800,
    rating: 4.4,
    amenities: ['Free Wi-Fi', 'Parking', 'Air Conditioning'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200'],
    contactNumber: '',
    email: ''
  }
];

const restaurantSamples = [
  {
    _id: 'demo-restaurant-1',
    name: 'The Fisherman’s Wharf',
    description: 'A lively dining experience featuring seafood, Goan specialities and waterfront-inspired ambience.',
    cuisine: ['Goan', 'Seafood', 'Indian'],
    location: { city: 'Cavelossim', address: 'Mobor Road, Cavelossim, Goa' },
    averageCost: 1200,
    rating: 4.7,
    openingTime: '12:00 PM',
    closingTime: '11:00 PM',
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'],
    contactNumber: ''
  },
  {
    _id: 'demo-restaurant-2',
    name: 'Mango Tree Kitchen',
    description: 'A relaxed tropical restaurant serving Indian favourites and fresh coastal flavours.',
    cuisine: ['Indian', 'Continental'],
    location: { city: 'Vagator', address: 'Vagator, North Goa' },
    averageCost: 850,
    rating: 4.5,
    openingTime: '10:00 AM',
    closingTime: '10:30 PM',
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200'],
    contactNumber: ''
  },
  {
    _id: 'demo-restaurant-3',
    name: 'Casa Portuguesa',
    description: 'A cosy dining spot inspired by Portuguese and traditional Goan food.',
    cuisine: ['Goan', 'Portuguese'],
    location: { city: 'Panjim', address: 'Fontainhas, Panjim, Goa' },
    averageCost: 1000,
    rating: 4.8,
    openingTime: '11:00 AM',
    closingTime: '10:00 PM',
    images: ['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200'],
    contactNumber: ''
  },
  {
    _id: 'demo-restaurant-4',
    name: 'Little Spice Garden',
    description: 'A casual restaurant offering aromatic curries, vegetarian options and local flavours.',
    cuisine: ['Indian', 'Vegetarian'],
    location: { city: 'Calangute', address: 'Calangute, North Goa' },
    averageCost: 550,
    rating: 4.3,
    openingTime: '09:00 AM',
    closingTime: '10:00 PM',
    images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200'],
    contactNumber: ''
  }
];

const money = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

const getImage = (item) =>
  item?.images?.[0] ||
  item?.image ||
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200';

const getCity = (item) =>
  item?.location?.city ||
  item?.city ||
  'Goa';

const getId = (item) => item?._id || item?.id;

const getRating = (item) => Number(item?.rating || 0);

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  'Something went wrong. Please try again.';

function PageHero({ eyebrow, title, description, image }) {
  return (
    <section
      className="discovery-hero"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(0,45,46,.84), rgba(0,45,46,.2)), url("${image}")` }}
    >
      <div className="discovery-hero-content">
        <span className="discovery-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function Rating({ value }) {
  return (
    <span className="discovery-rating">
      <Star size={15} fill="#FFC857" color="#FFC857" />
      <strong>{Number(value || 0).toFixed(1)}</strong>
    </span>
  );
}

function EmptyState({ title, message, onReset }) {
  return (
    <div className="discovery-empty">
      <Search size={38} />
      <h3>{title}</h3>
      <p>{message}</p>
      {onReset && (
        <button className="discovery-button" onClick={onReset}>
          Clear filters
        </button>
      )}
    </div>
  );
}

function ListingCard({ item, type }) {
  const isHotel = type === 'hotel';
  const id = getId(item);
  const location = getCity(item);

  return (
    <article className="discovery-card">
      <Link
        to={`/${isHotel ? 'hotels' : 'restaurants'}/${id}`}
        className="discovery-card-image"
      >
        <img src={getImage(item)} alt={item.name} loading="lazy" />
        <span className="discovery-card-tag">
          {isHotel ? item.category || 'Stay' : item.cuisine?.[0] || 'Dining'}
        </span>
      </Link>

      <div className="discovery-card-body">
        <div className="discovery-card-top">
          <span className="discovery-location">
            <MapPin size={14} />
            {location}, Goa
          </span>
          <Rating value={item.rating} />
        </div>

        <Link
          to={`/${isHotel ? 'hotels' : 'restaurants'}/${id}`}
          className="discovery-card-title"
        >
          {item.name}
        </Link>

        <p className="discovery-card-description">
          {item.description}
        </p>

        <div className="discovery-card-bottom">
          <div>
            <strong className="discovery-price">
              {money(isHotel ? item.pricePerNight : item.averageCost)}
            </strong>
            <span className="discovery-price-label">
              {isHotel ? '/ night' : '/ approx. for two'}
            </span>
          </div>

          <Link
            to={`/${isHotel ? 'hotels' : 'restaurants'}/${id}`}
            className="discovery-arrow"
            aria-label={`View ${item.name}`}
          >
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ListingPage({ type }) {
  const isHotel = type === 'hotel';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [minRating, setMinRating] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('recommended');

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      setLoading(true);
      setError('');

      try {
        const params = {
          ...(search.trim() && { search: search.trim() }),
          ...(city && { city }),
          ...(isHotel && category && { category }),
          ...(!isHotel && category && { cuisine: category }),
          ...(minPrice !== '' && { minPrice }),
          ...(maxPrice !== '' && { maxPrice }),
          ...(minRating !== '' && { minRating })
        };

        const response = isHotel
          ? await getHotels(params)
          : await getRestaurants(params);

        const payload = response.data;
        const records = isHotel
          ? payload.hotels || payload.data || []
          : payload.restaurants || payload.data || [];

        if (active) {
          setItems(records.length ? records : (isHotel ? hotelSamples : restaurantSamples));
        }
      } catch (err) {
        if (active) {
          setItems(isHotel ? hotelSamples : restaurantSamples);
          setError('Showing sample listings because the live catalogue is currently unavailable.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(loadItems, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [isHotel, search, city, category, minPrice, maxPrice, minRating]);

  const filtered = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        `${item.name} ${item.description} ${getCity(item)} ${(item.cuisine || []).join(' ')}`
          .toLowerCase().includes(q)
      );
    }

    if (city) {
      result = result.filter((item) =>
        getCity(item).toLowerCase().includes(city.toLowerCase())
      );
    }

    if (category) {
      result = result.filter((item) => {
        if (isHotel) return item.category === category;
        return (item.cuisine || []).some((c) =>
          c.toLowerCase().includes(category.toLowerCase())
        );
      });
    }

    if (minRating) {
      result = result.filter((item) => getRating(item) >= Number(minRating));
    }

    if (minPrice !== '') {
      result = result.filter((item) =>
        Number(isHotel ? item.pricePerNight : item.averageCost) >= Number(minPrice)
      );
    }

    if (maxPrice !== '') {
      result = result.filter((item) =>
        Number(isHotel ? item.pricePerNight : item.averageCost) <= Number(maxPrice)
      );
    }

    if (sort === 'price-low') {
      result.sort((a, b) =>
        Number(isHotel ? a.pricePerNight : a.averageCost) -
        Number(isHotel ? b.pricePerNight : b.averageCost)
      );
    } else if (sort === 'price-high') {
      result.sort((a, b) =>
        Number(isHotel ? b.pricePerNight : b.averageCost) -
        Number(isHotel ? a.pricePerNight : a.averageCost)
      );
    } else if (sort === 'rating') {
      result.sort((a, b) => getRating(b) - getRating(a));
    }

    return result;
  }, [items, search, city, category, minRating, minPrice, maxPrice, sort, isHotel]);

  const reset = () => {
    setSearch('');
    setCity('');
    setCategory('');
    setMinRating('');
    setMinPrice('');
    setMaxPrice('');
    setSort('recommended');
  };

  const title = isHotel ? 'Find Your Perfect Stay' : 'A Taste of Goa';
  const description = isHotel
    ? 'From boutique hideaways to beautiful beach resorts, discover places that make your Goan escape special.'
    : 'Discover local favourites, coastal kitchens and unforgettable dining experiences across Goa.';

  return (
    <main className="discovery-page">
      <PageHero
        eyebrow={isHotel ? 'STAY A LITTLE LONGER' : 'EXPLORE GOAN FLAVOURS'}
        title={title}
        description={description}
        image={isHotel
          ? 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1800'
          : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800'}
      />

      <section className="discovery-container">
        <div className="discovery-section-heading">
          <div>
            <span className="discovery-eyebrow dark">CURATED FOR YOUR GOA TRIP</span>
            <h2>{isHotel ? 'Stays worth discovering' : 'Places worth gathering around'}</h2>
            <p>
              {isHotel
                ? 'Find a comfortable base for every kind of getaway.'
                : 'Find your next favourite table, from local food to relaxed dining.'}
            </p>
          </div>
          <span className="discovery-count">{filtered.length} places</span>
        </div>

        <div className="discovery-filter-panel">
          <div className="discovery-filter-field search-field">
            <label>Search</label>
            <div className="discovery-input-wrap">
              <Search size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isHotel ? 'Search hotels or places...' : 'Search restaurants or food...'}
              />
            </div>
          </div>

          <div className="discovery-filter-field">
            <label>Location</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All Goa</option>
              {['Panaji', 'Candolim', 'Calangute', 'Baga', 'Anjuna', 'Vagator', 'Assagao', 'Margao', 'Palolem', 'Cavelossim'].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="discovery-filter-field">
            <label>{isHotel ? 'Stay type' : 'Cuisine'}</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All {isHotel ? 'types' : 'cuisines'}</option>
              {(isHotel
                ? ['Luxury', 'Resort', 'Budget', 'Homestay', 'Villa', 'Other']
                : ['Goan', 'Seafood', 'Indian', 'Continental', 'Portuguese', 'Vegetarian']
              ).map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="discovery-filter-field">
            <label>Minimum rating</label>
            <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="">Any rating</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </div>

          <div className="discovery-filter-field">
            <label>{isHotel ? 'Min price / night' : 'Min cost / person'}</label>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="₹ Min"
            />
          </div>

          <div className="discovery-filter-field">
            <label>{isHotel ? 'Max price / night' : 'Max cost / person'}</label>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="₹ Max"
            />
          </div>

          <div className="discovery-filter-field">
            <label>Sort by</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>

          <button className="discovery-reset" onClick={reset}>
            <SlidersHorizontal size={16} /> Reset
          </button>
        </div>

        {error && <p className="discovery-notice">{error}</p>}

        {loading ? (
          <div className="discovery-loading">
            <LoaderCircle className="spin" size={34} />
            <p>Finding lovely places...</p>
          </div>
        ) : filtered.length ? (
          <div className="discovery-grid">
            {filtered.map((item) => (
              <ListingCard key={getId(item)} item={item} type={type} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matches found"
            message="Try changing your search or clearing some filters."
            onReset={reset}
          />
        )}
      </section>

      <section className="discovery-bottom-cta">
        <Sparkles size={25} />
        <h2>{isHotel ? 'Planning a longer escape?' : 'Have a restaurant recommendation?'}</h2>
        <p>
          {isHotel
            ? 'Tell us what kind of stay you are looking for and send us an enquiry.'
            : 'Get in touch with us to share a local favourite or ask about dining.'}
        </p>
        <Link to="/contact" className="discovery-button">
          Contact us <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}

function EnquiryForm({ item, type }) {
  const isHotel = type === 'hotel';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    endDate: '',
    guests: '2',
    time: '',
    message: ''
  });

  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setSubmitting(true);

    const subject = isHotel
      ? `Hotel booking enquiry: ${item.name}`
      : `Restaurant table enquiry: ${item.name}`;

    const message = [
      `${isHotel ? 'Hotel' : 'Restaurant'}: ${item.name}`,
      `Phone: ${form.phone}`,
      isHotel ? `Check-in: ${form.date}` : `Date: ${form.date}`,
      isHotel ? `Check-out: ${form.endDate}` : `Preferred time: ${form.time}`,
      `Guests: ${form.guests}`,
      `Additional details: ${form.message || 'None'}`
    ].join('\n');

    try {
      await submitFeedback({
        name: form.name,
        email: form.email,
        subject,
        message,
        category: isHotel ? 'Hotel' : 'Restaurant'
      });

      setStatus('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        endDate: '',
        guests: '2',
        time: '',
        message: ''
      });
    } catch (error) {
      setStatus(getError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="discovery-enquiry-form" onSubmit={handleSubmit}>
      <div className="discovery-form-heading">
        <span className="discovery-eyebrow dark">LET'S PLAN IT</span>
        <h3>{isHotel ? 'Send a stay enquiry' : 'Enquire about a table'}</h3>
        <p>
          {isHotel
            ? 'Share your travel dates and we will receive your enquiry.'
            : 'Tell us when you would like to visit and how many guests to expect.'}
        </p>
      </div>

      {status === 'success' && (
        <div className="discovery-success">
          <CheckCircle2 size={19} />
          Your enquiry has been submitted successfully!
        </div>
      )}

      {status && status !== 'success' && (
        <div className="discovery-error">{status}</div>
      )}

      <div className="discovery-form-grid">
        <label>
          Full name
          <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" />
        </label>

        <label>
          Email address
          <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
        </label>

        <label>
          Contact number
          <input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Your phone number" />
        </label>

        <label>
          {isHotel ? 'Check-in date' : 'Visit date'}
          <input required type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(e) => update('date', e.target.value)} />
        </label>

        {isHotel ? (
          <label>
            Check-out date
            <input required type="date" min={form.date || new Date().toISOString().split('T')[0]} value={form.endDate} onChange={(e) => update('endDate', e.target.value)} />
          </label>
        ) : (
          <label>
            Preferred time
            <input required type="time" value={form.time} onChange={(e) => update('time', e.target.value)} />
          </label>
        )}

        <label>
          Number of guests
          <select value={form.guests} onChange={(e) => update('guests', e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="discovery-message-label">
        Additional requests
        <textarea
          rows="3"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Any preferences or special requests?"
        />
      </label>

      <button className="discovery-button discovery-submit" type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Send enquiry'}
        {submitting ? <LoaderCircle size={17} className="spin" /> : <Send size={17} />}
      </button>

      <small className="discovery-form-note">
        This is an enquiry, not a confirmed booking or reservation.
      </small>
    </form>
  );
}

function DetailPage({ type }) {
  const isHotel = type === 'hotel';
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const samples = isHotel ? hotelSamples : restaurantSamples;
    const demo = samples.find((entry) => getId(entry) === id);

    if (demo) {
      setItem(demo);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const response = isHotel
          ? await getHotelById(id)
          : await getRestaurantById(id);

        const record = isHotel
          ? response.data.hotel
          : response.data.restaurant;

        if (active) {
          if (record) setItem(record);
          else setNotFound(true);
        }
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [id, isHotel]);

  if (loading) {
    return <div className="discovery-loading detail-loading"><LoaderCircle size={34} className="spin" /> Loading details...</div>;
  }

  if (notFound || !item) {
    return (
      <main className="discovery-empty detail-empty">
        <h2>We couldn't find this listing</h2>
        <button className="discovery-button" onClick={() => navigate(isHotel ? '/hotels' : '/restaurants')}>
          Back to {isHotel ? 'stays' : 'restaurants'}
        </button>
      </main>
    );
  }

  const city = getCity(item);
  const address = item.location?.address || `${city}, Goa`;
  const photos = item.images?.length ? item.images : [getImage(item)];

  return (
    <main className="discovery-detail-page">
      <div className="discovery-detail-top">
        <button onClick={() => navigate(-1)} className="discovery-back">
          <ArrowLeft size={17} /> Back
        </button>
        <span>{isHotel ? 'STAYS IN GOA' : 'DINING IN GOA'}</span>
      </div>

      <section className="discovery-detail-hero">
        <img src={getImage(item)} alt={item.name} />
        <div className="discovery-detail-overlay">
          <span className="discovery-eyebrow">
            {isHotel ? item.category || 'Stay' : (item.cuisine || []).join(' · ') || 'Restaurant'}
          </span>
          <h1>{item.name}</h1>
          <p><MapPin size={17} /> {address}</p>
          <Rating value={item.rating} />
        </div>
      </section>

      <div className="discovery-detail-layout">
        <div className="discovery-detail-main">
          <section className="discovery-detail-section">
            <span className="discovery-eyebrow dark">ABOUT THIS PLACE</span>
            <h2>{isHotel ? 'Your Goa getaway' : 'A place to enjoy good food'}</h2>
            <p>{item.description}</p>
          </section>

          <section className="discovery-detail-section">
            <h2>{isHotel ? 'Gallery' : 'A look inside'}</h2>
            <div className="discovery-gallery">
              {photos.slice(0, 4).map((photo, index) => (
                <a key={index} href={photo} target="_blank" rel="noreferrer">
                  <img src={photo} alt={`${item.name} ${index + 1}`} loading="lazy" />
                </a>
              ))}
            </div>
          </section>

          {isHotel ? (
            <section className="discovery-detail-section">
              <h2>Facilities & amenities</h2>
              <div className="discovery-amenities">
                {(item.amenities || []).length ? item.amenities.map((amenity) => (
                  <span key={amenity}><CheckCircle2 size={16} /> {amenity}</span>
                )) : <p>Contact the property to confirm available amenities.</p>}
              </div>
            </section>
          ) : (
            <>
              <section className="discovery-detail-section">
                <h2>Cuisine</h2>
                <div className="discovery-amenities">
                  {(item.cuisine || []).map((cuisine) => (
                    <span key={cuisine}><Utensils size={16} /> {cuisine}</span>
                  ))}
                </div>
              </section>

              {item.menu?.length > 0 && (
                <section className="discovery-detail-section">
                  <h2>Menu highlights</h2>
                  <div className="discovery-menu-list">
                    {item.menu.map((entry, index) => (
                      <div key={index}>
                        <span>{entry.itemName}</span>
                        <strong>{money(entry.price)}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          <section className="discovery-detail-section">
            <h2>Location & contact</h2>
            <p><MapPin size={17} /> {address}</p>
            {item.contactNumber && <p><Phone size={17} /> {item.contactNumber}</p>}
            {item.email && <p><Mail size={17} /> {item.email}</p>}
            {!isHotel && item.openingTime && (
              <p><Clock size={17} /> {item.openingTime} – {item.closingTime || 'Hours not listed'}</p>
            )}
            <a
              className="discovery-map-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + address)}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Google Maps <ArrowRight size={16} />
            </a>
          </section>
        </div>

        <aside className="discovery-detail-sidebar">
          <div className="discovery-price-card">
            <span>{isHotel ? 'Starting from' : 'Average cost'}</span>
            <strong>{money(isHotel ? item.pricePerNight : item.averageCost)}</strong>
            <small>{isHotel ? 'per night' : 'approximate cost for two'}</small>
            <div className="discovery-price-divider" />
            <div className="discovery-sidebar-info">
              <span><MapPin size={15} /> {city}, Goa</span>
              <span><Star size={15} color="#D99B16" /> {Number(item.rating || 0).toFixed(1)} / 5 rating</span>
              {isHotel
                ? <span><BedDouble size={15} /> {item.category || 'Accommodation'}</span>
                : <span><Clock size={15} /> {item.openingTime || 'Check opening hours'}</span>}
            </div>
          </div>

          <EnquiryForm item={item} type={type} />
        </aside>
      </div>
    </main>
  );
}

export function HotelsPage() {
  return <ListingPage type="hotel" />;
}

export function HotelDetailsPage() {
  return <DetailPage type="hotel" />;
}

export function RestaurantsPage() {
  return <ListingPage type="restaurant" />;
}

export function RestaurantDetailsPage() {
  return <DetailPage type="restaurant" />;
}

export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'Other',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, value) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      await submitFeedback(form);
      setStatus('success');
      setForm({
        name: '',
        email: '',
        subject: '',
        category: 'Other',
        message: ''
      });
    } catch (error) {
      setStatus(getError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="discovery-page">
      <PageHero
        eyebrow="WE'RE HERE TO HELP"
        title="Let's talk about Goa"
        description="Questions about a stay, a restaurant or your next trip? Send us a message."
        image="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1800"
      />

      <section className="discovery-contact-wrap">
        <div>
          <span className="discovery-eyebrow dark">GET IN TOUCH</span>
          <h2>We'd love to hear from you.</h2>
          <p>Use the form to share your question, feedback or travel enquiry. Our team can review your message through the website's feedback system.</p>
          <div className="discovery-contact-note">
            <Mail size={20} />
            <div>
              <strong>Send us a message</strong>
              <span>Your enquiry will be recorded in our system.</span>
            </div>
          </div>
          <div className="discovery-contact-note">
            <MapPin size={20} />
            <div>
              <strong>Explore Goa</strong>
              <span>Beaches, heritage, food and unforgettable stays.</span>
            </div>
          </div>
        </div>

        <form className="discovery-enquiry-form contact-form" onSubmit={handleSubmit}>
          <h3>Send a message</h3>

          {status === 'success' && <div className="discovery-success"><CheckCircle2 size={18} /> Message submitted successfully.</div>}
          {status && status !== 'success' && <div className="discovery-error">{status}</div>}

          <label>Full name<input required value={form.name} onChange={(e) => update('name', e.target.value)} /></label>
          <label>Email address<input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label>
          <label>Enquiry category
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {['Website', 'Booking', 'Destination', 'Hotel', 'Restaurant', 'Other'].map((v) => <option key={v}>{v}</option>)}
            </select>
          </label>
          <label>Subject<input required value={form.subject} onChange={(e) => update('subject', e.target.value)} /></label>
          <label>Message<textarea required rows="5" value={form.message} onChange={(e) => update('message', e.target.value)} /></label>
          <button className="discovery-button discovery-submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send message'} <Send size={17} />
          </button>
        </form>
      </section>
    </main>
  );
}
