import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  ArrowRight,
  Compass,
  Hotel,
  Utensils,
  Waves,
} from 'lucide-react';
import { getPlaces } from '../services/placeService';

const fallbackPlaces = [
  {
    _id: '1',
    name: 'Dudhsagar Waterfalls',
    region: 'South Goa',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=900',
    description: 'Experience the beauty of one of Indiaâ€™s tallest waterfalls.',
  },
  {
    _id: '2',
    name: 'Fort Aguada',
    region: 'North Goa',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=900',
    description: 'Discover Goaâ€™s fascinating Portuguese-era history.',
  },
  {
    _id: '3',
    name: 'Palolem Beach',
    region: 'South Goa',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900',
    description: 'Relax along a beautiful crescent-shaped coastline.',
  },
];

const styles = {
  page: { color: '#183b3b' },
  hero: {
    minHeight: '520px',
    padding: '90px 7%',
    display: 'flex',
    alignItems: 'center',
    background:
      'linear-gradient(90deg, rgba(0,45,46,.82), rgba(0,45,46,.25)), url("https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1800") center/cover',
    color: '#fff',
  },
  heroContent: { maxWidth: '680px' },
  eyebrow: {
    color: '#FFC857',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontSize: '13px',
  },
  heading: {
    color: '#FFFFFF',
    fontFamily: 'Playfair Display, Georgia, serif',
    fontSize: 'clamp(42px, 7vw, 72px)',
    lineHeight: 1.08,
    margin: '18px 0',
  },
  search: {
    display: 'flex',
    gap: '10px',
    background: '#fff',
    borderRadius: '12px',
    padding: '9px',
    maxWidth: '540px',
    marginTop: '30px',
  },
  input: {
    flex: 1,
    minWidth: 0,
    border: 0,
    outline: 0,
    padding: '12px',
    color: '#183b3b',
    fontSize: '15px',
  },
  button: {
    background: '#FFC857',
    color: '#183b3b',
    border: 0,
    borderRadius: '9px',
    padding: '12px 20px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  section: { padding: '65px 7%' },
  sectionTitle: {
    fontFamily: 'Playfair Display, Georgia, serif',
    fontSize: '36px',
    margin: '8px 0 12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginTop: '30px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 5px 24px rgba(0,0,0,.08)',
  },
  cardImage: { width: '100%', height: '210px', objectFit: 'cover' },
  cardBody: { padding: '20px' },
  link: {
    color: '#006D6F',
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
  },
};

function getImage(place) {
  return (
    place.image ||
    place.imageUrl ||
    place.coverImage ||
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900'
  );
}

export default function Home() {
  const [places, setPlaces] = useState(fallbackPlaces);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPlaces() {
      try {
        const response = await getPlaces();
        const data = response?.data?.places || response?.data || [];

        if (active && Array.isArray(data) && data.length > 0) {
          setPlaces(data.slice(0, 6));
        }
      } catch (error) {
        console.error('Could not load destinations:', error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPlaces();

    return () => {
      active = false;
    };
  }, []);

  const filteredPlaces = places.filter((place) =>
    `${place.name || ''} ${place.region || ''} ${place.category || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.eyebrow}>Discover the magic of Goa</span>

          <h1 style={styles.heading}>
            Find your own
            <br />
            little piece of Goa.
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.8, maxWidth: '550px', color: 'rgba(255,255,255,0.92)' }}>
            From quiet beaches and hidden waterfalls to colourful streets and
            unforgettable food, your Goan adventure starts here.
          </p>

          <form
            style={styles.search}
            onSubmit={(event) => {
              event.preventDefault();
              window.location.href = `/places?search=${encodeURIComponent(search)}`;
            }}
          >
            <Search color="#006D6F" />
            <input
              style={styles.input}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search beaches, forts, waterfalls..."
              aria-label="Search destinations"
            />
            <button style={styles.button} type="submit">
              Explore
            </button>
          </form>
        </div>
      </section>

      <section style={styles.section}>
        <span style={styles.eyebrow}>Explore the possibilities</span>
        <h2 style={styles.sectionTitle}>Goa has something for everyone.</h2>
        <p style={{ color: '#637777', maxWidth: '650px', lineHeight: 1.7 }}>
          Whether you love the outdoors, culture, food or simply doing nothing
          by the sea, find experiences that make your trip memorable.
        </p>

        <div style={styles.grid}>
          {[
            { icon: <Waves size={28} />, title: 'Beaches', text: 'Find your perfect stretch of coastline.', path: '/places?category=Beach' },
            { icon: <Hotel size={28} />, title: 'Stays', text: 'Discover places to stay across Goa.', path: '/hotels' },
            { icon: <Utensils size={28} />, title: 'Food & dining', text: 'Explore Goan restaurants and local flavours.', path: '/restaurants' },
            { icon: <Compass size={28} />, title: 'Experiences', text: 'Find culture, nature and adventure.', path: '/packages' },
          ].map((item) => (
            <Link
              key={item.title}
              className="home-category-card"
              to={item.path}
              style={{
                ...styles.cardBody,
                ...styles.card,
                textDecoration: 'none',
                color: '#183b3b',
              }}
            >
              <div style={{ color: '#006D6F' }}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p style={{ color: '#637777', lineHeight: 1.6 }}>{item.text}</p>
              <span style={styles.link}>Explore <ArrowRight size={16} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ ...styles.section, background: '#f2f8f6' }}>
        <span style={styles.eyebrow}>Places worth discovering</span>
        <h2 style={styles.sectionTitle}>A few favourites.</h2>
        <p style={{ color: '#637777' }}>
          Start exploring some of Goa's most loved destinations.
        </p>

        {loading && (
          <p style={{ color: '#637777' }}>Loading destinations...</p>
        )}

        <div style={styles.grid}>
          {filteredPlaces.map((place) => (
            <article className="home-destination-card" key={place._id || place.name} style={styles.card}>
              <img
                src={getImage(place)}
                alt={place.name}
                style={styles.cardImage}
                loading="lazy"
              />
              <div style={styles.cardBody}>
                <span style={{ color: '#00877f', fontSize: '13px', fontWeight: 700 }}>
                  {place.region || place.category || 'Goa'}
                </span>
                <h3 style={{ margin: '9px 0' }}>{place.name}</h3>
                <p style={{ color: '#637777', lineHeight: 1.6 }}>
                  {place.description || 'Discover this beautiful destination in Goa.'}
                </p>
                <Link
                  to={`/places/${place._id}`}
                  style={styles.link}
                >
                  Discover more <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '35px' }}>
          <Link to="/places" style={styles.link}>
            View all destinations <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

