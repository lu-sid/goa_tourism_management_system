
import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Heart,
  Compass,
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: <MapPin size={25} />,
    title: 'Discover Goa',
    description:
      'Explore beautiful beaches, heritage sites, hidden gems and scenic destinations across Goa.'
  },
  {
    icon: <Compass size={25} />,
    title: 'Explore Freely',
    description:
      'Find destinations, restaurants and stays that match your travel preferences.'
  },
  {
    icon: <Heart size={25} />,
    title: 'Save Your Favourites',
    description:
      'Keep your favourite places together and make planning your next trip easier.'
  },
  {
    icon: <Users size={25} />,
    title: 'Travel Better',
    description:
      'Discover experiences that help you enjoy Goa beyond the usual tourist spots.'
  }
];

export default function About() {
  return (
    <main className="about-page">
      <section className="section container">
        <div className="section-heading">
          <span className="eyebrow">OUR STORY</span>
          <h1>Experience the real <span>Goa.</span></h1>
          <p>
            Sushegad Goa is your companion for discovering the culture,
            destinations, flavours and experiences that make Goa special.
          </p>
        </div>

        <div className="about-content">
          <div>
            <h2>More than just a destination</h2>
            <p>
              Goa is a beautiful blend of golden beaches, Portuguese
              heritage, vibrant markets, local cuisine and peaceful
              landscapes.
            </p>
            <p>
              Our goal is to bring these experiences together in one
              convenient platform so travellers can discover places,
              explore stays and plan memorable journeys.
            </p>
            <Link to="/places" className="btn btn-primary">
              Explore destinations <ArrowRight size={18} />
            </Link>
          </div>

          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900"
              alt="Beautiful tropical beach in Goa"
            />
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <span className="eyebrow">WHY SUSHEGAD GOA</span>
          <h2>Everything you need to explore</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="about-cta">
          <Sparkles size={30} />
          <h2>Your Goa story starts here.</h2>
          <p>Discover something new around every corner.</p>
          <Link to="/places" className="btn btn-primary">
            Start exploring <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
