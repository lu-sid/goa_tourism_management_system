import { Routes, Route, Link } from 'react-router-dom';
import {
  MapPin,
  Home as HomeIcon,
  Compass,
  UserRound,
  Heart,
  CalendarDays,
  MessageSquare,
} from 'lucide-react';
import React from 'react';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import MapPage from './pages/MapPage';
import PlaceDetailsPage from './pages/places/PlaceDetailsPage';
import {
  HotelsPage,
  HotelDetailsPage,
  RestaurantsPage,
  RestaurantDetailsPage,
  ContactPage
} from './components/discovery/DiscoveryPages';

import Profile from './pages/user/Profile';
import MyBookings from './pages/user/MyBookings';
import MyReviews from './pages/user/MyReviews';
import SavedPlaces from './pages/user/SavedPlaces';

function Navbar() {
  const navLinkStyle = {
    textDecoration: 'none',
    color: '#183b3b',
    fontWeight: 600,
    fontSize: '14px',
  };

  return (
    <header
      style={{
        background: '#ffffff',
        padding: '15px 6%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '18px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          textDecoration: 'none',
          color: '#006D6F',
        }}
      >
        <MapPin size={27} />
        <span
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontWeight: 700,
            fontSize: '23px',
          }}
        >
          Sushegad Goa
        </span>
      </Link>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <Link to="/" style={navLinkStyle}>
          Home
        </Link>

        <Link to="/about" style={navLinkStyle}>
          About
        </Link>

        <Link to="/places" style={navLinkStyle}>
          Destinations
        </Link>

        <Link to="/hotels" style={navLinkStyle}>
          Stays
        </Link>

        <Link to="/restaurants" style={navLinkStyle}>
          Restaurants
        </Link>

        <Link to="/saved-places" style={navLinkStyle}>
          <Heart size={16} style={{ verticalAlign: 'middle' }} /> Saved
        </Link>

        <Link
          to="/profile"
          style={{
            ...navLinkStyle,
            background: '#006D6F',
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: '8px',
          }}
        >
          My Account
        </Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: '#004f50',
        color: '#ffffff',
        padding: '35px 7%',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
        Sushegad Goa
      </h2>

      <p style={{ color: '#d0e5df', lineHeight: 1.7 }}>
        Discover the beaches, culture, food and hidden gems of Goa.
      </p>

      <p style={{ color: '#b7d2cb', fontSize: '13px' }}>
        Â© {new Date().getFullYear()} Sushegad Goa. All rights reserved.
      </p>
    </footer>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <main
      style={{
        minHeight: '60vh',
        padding: '70px 7%',
        textAlign: 'center',
        background: '#f2f8f6',
        color: '#183b3b',
      }}
    >
      <Compass size={42} color="#00877f" />

      <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
        {title}
      </h1>

      <p style={{ color: '#637777' }}>{description}</p>

      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: '15px',
          padding: '12px 20px',
          background: '#006D6F',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
        }}
      >
        Back to Home
      </Link>
    </main>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/map" element={<MapPage />} />

        <Route
          path="/places"
          element={
            <PlaceholderPage
              title="Explore Goa"
              description="Discover beaches, forts, waterfalls and beautiful destinations across Goa."
            />
          }
        />

        <Route path="/places/:id" element={<PlaceDetailsPage />} />

        <Route
          path="/hotels"
          element={
            <PlaceholderPage
              title="Places to Stay"
              description="Discover hotels, resorts and stays across Goa."
            />
          }
        />

        <Route
          path="/restaurants"
          element={
            <PlaceholderPage
              title="Restaurants"
              description="Explore restaurants and discover Goan cuisine."
            />
          }
        />

        <Route
          path="/packages"
          element={
            <PlaceholderPage
              title="Travel Experiences"
              description="Explore experiences and travel packages in Goa."
            />
          }
        />

        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/saved-places" element={<SavedPlaces />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;


