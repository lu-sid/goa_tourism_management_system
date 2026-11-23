import AdminDashboard from "./pages/admin/AdminDashboard";
import React from 'react';
import {
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';

import {
  MapPin,
  Heart,
  LogOut,
  UserRound,
  CalendarDays,
  Compass
} from 'lucide-react';

import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import MapPage from './pages/MapPage';
import PlacesPage from './pages/places/PlacesPage';
import DestinationDetailsRouter from './pages/places/DestinationDetailsRouter';

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
import Packages from './pages/packages/Packages';
import PackageDetailsPage from './pages/packages/PackageDetailsPage';
import ManagePackages from './pages/admin/ManagePackages';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import useAuth from './hooks/useAuth';

function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#183b3b',
    fontWeight: 600,
    fontSize: '14px'
  };

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <header className="site-header">
      <Link to="/" className="site-brand">
        <MapPin size={27} />
        <span>Sushegad Goa</span>
      </Link>

      <nav className="site-nav">
        <Link to="/" style={navLinkStyle}>Home</Link>
        <Link to="/about" style={navLinkStyle}>About</Link>
        <Link to="/places" style={navLinkStyle}>Destinations</Link>
        <Link to="/hotels" style={navLinkStyle}>Stays</Link>
        <Link to="/restaurants" style={navLinkStyle}>Restaurants</Link>
        <Link to="/packages" style={navLinkStyle}>Experiences</Link>

        <Link to="/saved-places" style={navLinkStyle}>
          <Heart size={16} style={{ verticalAlign: 'middle' }} /> Saved
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/my-bookings" style={navLinkStyle}>
              <CalendarDays size={15} style={{ verticalAlign: 'middle' }} /> My Bookings
            </Link>

            {isAdmin && (
              <>
                <Link to="/admin" style={navLinkStyle}>Admin</Link>
                <Link to="/admin/packages" style={navLinkStyle}>Manage Packages</Link>
              </>
            )}

            <Link to="/profile" className="nav-account">
              <UserRound size={16} />
              {user?.name?.split(' ')[0] || 'My Account'}
            </Link>

            <button className="nav-logout" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLinkStyle}>Sign in</Link>
            <Link to="/register" className="nav-account">
              Create account
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <h2>Sushegad Goa</h2>
      <p>
        Discover the beaches, culture, food and hidden gems of Goa.
      </p>
      <p className="footer-copy">
        © {new Date().getFullYear()} Sushegad Goa. All rights reserved.
      </p>
    </footer>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <main className="placeholder-page">
      <Compass size={42} color="#00877f" />
      <h1>{title}</h1>
      <p>{description}</p>
      <Link to="/">Back to Home</Link>
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

        <Route path="/places" element={<PlacesPage />} />

        <Route path="/places/:id" element={<DestinationDetailsRouter />} />

        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/:id" element={<HotelDetailsPage />} />

        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />

        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetailsPage />} />

        <Route path="/saved-places" element={<SavedPlaces />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-reviews" element={<MyReviews />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/packages" element={<ManagePackages />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;




