import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from 'react-leaflet';
import {
  ArrowRight, ArrowUpRight, Search, MapPin, Heart, Menu, X, Waves, Compass,
  Camera, Mountain, Landmark, Utensils, Sun, Sparkles, LocateFixed, LoaderCircle,
  SlidersHorizontal, ExternalLink, Navigation, Map as MapIcon, Leaf, Star
} from 'lucide-react';

const OVERPASS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter'
];

const featured = [
  { id: 'palolem', name: 'Palolem Beach', area: 'Canacona, South Goa', kind: 'Beach', lat: 15.0100, lon: 74.0232, note: 'A beautiful crescent of sand and calm water.', query: 'Palolem Beach Goa' },
  { id: 'aguada', name: 'Fort Aguada', area: 'Candolim, North Goa', kind: 'Heritage', lat: 15.4920, lon: 73.7730, note: 'A historic Portuguese fort overlooking the Arabian Sea.', query: 'Fort Aguada Goa' },
  { id: 'dudhsagar', name: 'Dudhsagar Falls', area: 'Mollem, Goa', kind: 'Nature', lat: 15.3144, lon: 74.3143, note: 'A spectacular waterfall in the Western Ghats.', query: 'Dudhsagar Falls Goa' },
  { id: 'fontainhas', name: 'Fontainhas', area: 'Panaji, Goa', kind: 'Culture', lat: 15.4989, lon: 73.8278, note: 'Colourful Portuguese-era streets and old houses.', query: 'Fontainhas Panjim Goa' },
  { id: 'basilica', name: 'Basilica of Bom Jesus', area: 'Old Goa', kind: 'Heritage', lat: 15.5009, lon: 73.9110, note: 'A landmark church and UNESCO World Heritage site.', query: 'Basilica of Bom Jesus Goa' },
  { id: 'arambol', name: 'Arambol Beach', area: 'Pernem, North Goa', kind: 'Beach', lat: 15.6868, lon: 73.7045, note: 'A relaxed beach known for its lively creative scene.', query: 'Arambol Beach Goa' },
  { id: 'chapora', name: 'Chapora Fort', area: 'Vagator, North Goa', kind: 'Heritage', lat: 15.603, lon: 73.739, note: 'Hilltop fort ruins with sweeping coastal views.', query: 'Chapora Fort Goa' },
  { id: 'bondla', name: 'Bondla Wildlife Sanctuary', area: 'Usgao, Goa', kind: 'Nature', lat: 15.4167, lon: 74.1000, note: 'A green escape with forest trails and wildlife.', query: 'Bondla Wildlife Sanctuary Goa' }
];

const heroPhotos = [
  { title: 'Coastline days', query: 'Goa India beach coastline' },
  { title: 'Colourful old quarters', query: 'Fontainhas Panjim colourful houses' },
  { title: 'Into the green', query: 'Dudhsagar waterfall Goa' },
  { title: 'Slow village mornings', query: 'Goa palm trees village landscape' }
];

function cleanName(tags = {}) {
  return tags.name || tags['name:en'] || tags.brand || tags.operator || tags.tourism || tags.historic || tags.natural || 'Interesting place';
}
function classify(tags = {}) {
  if (tags.natural || tags.leisure === 'beach_resort' || tags.sport === 'surfing') return 'Nature';
  if (tags.historic || tags.heritage || tags.amenity === 'place_of_worship' || tags.tourism === 'museum') return 'Heritage';
  if (tags.tourism === 'attraction' || tags.tourism === 'viewpoint') return 'Attraction';
  if (tags.amenity === 'restaurant' || tags.amenity === 'cafe') return 'Food';
  return 'Place';
}
function coordsOf(el) {
  if (el.type === 'node') return [el.lat, el.lon];
  if (el.center) return [el.center.lat, el.center.lon];
  return null;
}
function mapsUrl(lat, lon) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}
function osmUrl(place) {
  return `https://www.openstreetmap.org/${place.type}/${place.osmId}`;
}

async function geocodePlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Could not look up that location. Please try another search.');
  const data = await response.json();
  if (!data.length) throw new Error(`We couldn't find "${query}". Try a town, village, beach or landmark name.`);
  return {
    lat: Number(data[0].lat), lon: Number(data[0].lon),
    name: data[0].name || data[0].display_name.split(',')[0],
    display: data[0].display_name
  };
}

async function fetchNearbyPlaces(lat, lon, radius = 10000) {
  const query = `[out:json][timeout:25];
(
  nwr(around:${radius},${lat},${lon})["tourism"~"attraction|museum|viewpoint|gallery|artwork|zoo|theme_park"];
  nwr(around:${radius},${lat},${lon})["historic"];
  nwr(around:${radius},${lat},${lon})["natural"~"beach|waterfall|cave|peak|hot_spring"];
  nwr(around:${radius},${lat},${lon})["leisure"~"park|garden|nature_reserve|beach_resort"];
  nwr(around:${radius},${lat},${lon})["amenity"~"place_of_worship|restaurant|cafe"];
);
out center tags;`;
  let lastError;
  for (const endpoint of OVERPASS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 28000);
      const response = await fetch(endpoint, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!response.ok) throw new Error('The places service is busy. Please try again in a moment.');
      const data = await response.json();
      const seen = new Set();
      return (data.elements || []).map(el => {
        const point = coordsOf(el);
        if (!point) return null;
        const tags = el.tags || {};
        const name = cleanName(tags);
        const key = `${name}-${point[0].toFixed(4)}-${point[1].toFixed(4)}`;
        if (seen.has(key)) return null;
        seen.add(key);
        return {
          id: `osm-${el.type}-${el.id}`, osmId: el.id, type: el.type,
          name, area: tags['addr:suburb'] || tags['addr:city'] || tags['addr:town'] || tags['addr:village'] || '',
          kind: classify(tags), lat: point[0], lon: point[1],
          note: tags.description || tags['description:en'] || `${classify(tags)} listed on OpenStreetMap.`,
          query: name, website: tags.website || tags['contact:website'] || '',
          wikidata: tags.wikidata || ''
        };
      }).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 70);
    } catch (error) { lastError = error; }
  }
  throw lastError || new Error('Could not retrieve nearby places.');
}

async function commonsImage(searchTerm) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(`filetype:bitmap ${searchTerm}`)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json&origin=*`;
    const response = await fetch(url);
    const data = await response.json();
    const page = Object.values(data.query?.pages || {})[0];
    return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || '';
  } catch { return ''; }
}

function Photo({ query, alt, className = '', fallback = '' }) {
  const [src, setSrc] = useState(fallback);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    if (fallback) setSrc(fallback);
    commonsImage(query).then(url => { if (alive && url) setSrc(url); });
    return () => { alive = false; };
  }, [query, fallback]);
  return src && !failed
    ? <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
    : <div className={`photo-fallback ${className}`}><Compass size={28}/><span>{alt}</span></div>;
}

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, zoom || 12, { duration: 1.1 }); }, [center, zoom, map]);
  return null;
}

function App() {
  const [locationInput, setLocationInput] = useState('Goa, India');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState({ lat: 15.35, lon: 73.98, name: 'Goa', display: 'Goa, India' });
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [radius, setRadius] = useState('10000');
  const [category, setCategory] = useState('All');
  const [saved, setSaved] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [usingLocation, setUsingLocation] = useState(false);

  const filtered = useMemo(() => places.filter(p => {
    const text = `${p.name} ${p.kind} ${p.area} ${p.note}`.toLowerCase();
    return (category === 'All' || p.kind === category) && (!keyword.trim() || text.includes(keyword.trim().toLowerCase()));
  }), [places, category, keyword]);

  function notify(message) {
    setToast(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(''), 2800);
  }

  async function searchAround(placeText = locationInput) {
    if (!placeText.trim()) { setError('Enter a place name first.'); return; }
    setLoading(true); setError(''); setSearched(true); setPlaces([]);
    try {
      const foundLocation = await geocodePlace(placeText);
      setLocation(foundLocation);
      const foundPlaces = await fetchNearbyPlaces(foundLocation.lat, foundLocation.lon, Number(radius));
      setPlaces(foundPlaces);
      if (!foundPlaces.length) setError('No mapped attractions were found in this radius. Try increasing the search distance.');
    } catch (e) { setError(e.message || 'Something went wrong while searching.'); }
    finally { setLoading(false); }
  }

  function searchMyLocation() {
    if (!navigator.geolocation) { setError('Your browser does not support location access.'); return; }
    setUsingLocation(true); setError('');
    navigator.geolocation.getCurrentPosition(async pos => {
      const point = { lat: pos.coords.latitude, lon: pos.coords.longitude, name: 'Your location', display: 'Near your current location' };
      setLocation(point); setLocationInput('Near me'); setLoading(true); setSearched(true);
      try {
        const found = await fetchNearbyPlaces(point.lat, point.lon, Number(radius));
        setPlaces(found);
        if (!found.length) setError('No mapped attractions found nearby. Try a larger radius.');
      } catch (e) { setError(e.message || 'Could not find places nearby.'); }
      finally { setLoading(false); setUsingLocation(false); }
    }, err => {
      setUsingLocation(false);
      setError(err.code === 1 ? 'Location permission was denied. You can type a town or area instead.' : 'Could not get your location. Please try typing a place.');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  }

  function toggleSaved(place) {
    setSaved(old => old.some(p => p.id === place.id) ? old.filter(p => p.id !== place.id) : [...old, place]);
    notify(saved.some(p => p.id === place.id) ? 'Removed from your saved places' : 'Saved to your Goa list');
  }

  const categories = ['All', 'Nature', 'Heritage', 'Attraction', 'Food', 'Place'];

  return <div id="top">
    <div className="announcement"><Sparkles size={14}/> YOUR LIVE LITTLE GUIDE TO GOA <span>·</span> DISCOVER MORE, WANDER FURTHER</div>
    <header className="header">
      <a className="brand" href="#top"><span className="brand-icon"><Sun size={23}/></span><span>SUSHEGAD TRAILS<span className="brand-dot">.</span><small>FIND YOUR GOA</small></span></a>
      <nav className={mobileMenu ? 'nav open' : 'nav'}>
        <a href="#top" onClick={() => setMobileMenu(false)}>Home</a>
        <a href="#discover" onClick={() => setMobileMenu(false)}>Discover places</a>
        <a href="#map" onClick={() => setMobileMenu(false)}>Explore map</a>
        <a href="#inspiration" onClick={() => setMobileMenu(false)}>Inspiration</a>
      </nav>
      <div className="header-actions"><a className="saved-link" href="#saved"><Heart size={16}/> Saved <b>{saved.length}</b></a><a className="header-cta" href="#discover">Explore Goa <ArrowUpRight size={16}/></a></div>
      <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">{mobileMenu ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero">
        <div className="hero-backdrop"><Photo query="Goa India aerial coastline beach turquoise sea" alt="Goa coastline" className="hero-photo"/></div>
        <div className="hero-shade"/>
        <div className="hero-content">
          <span className="eyebrow light"><i/> A LITTLE SUN, A LOT OF SOUL</span>
          <h1>Find the Goa<br/><em>that feels like yours.</em></h1>
          <p>Hidden corners, familiar favourites and places you haven’t discovered yet. Start anywhere.</p>
          <div className="hero-buttons"><a className="btn coral" href="#discover">Find places <ArrowUpRight size={17}/></a><a className="btn glass" href="#inspiration">Get inspired <ArrowRight size={17}/></a></div>
          <div className="hero-caption"><span>GOA, INDIA</span><span>15°29' N · 73°49' E</span></div>
        </div>
        <div className="hero-side-note">COAST · CULTURE · NATURE · FOOD</div>
      </section>

      <section className="photo-strip section-wrap" id="inspiration">
        <div className="strip-intro"><span className="eyebrow">A FEW REASONS TO WANDER</span><h2>Goa has a view<br/><em>for every mood.</em></h2><p>From the first light on the water to the last walk through a quiet lane.</p></div>
        <div className="strip-grid">
          {heroPhotos.map((photo, i) => <article className={`strip-card strip-${i + 1}`} key={photo.title}><Photo query={photo.query} alt={photo.title}/><span>{photo.title}</span></article>)}
        </div>
      </section>

      <section className="discover section-wrap" id="discover">
        <div className="section-heading"><div><span className="eyebrow">YOUR NEXT LITTLE ADVENTURE</span><h2>Find places <em>anywhere.</em></h2><p>Enter a town, village, beach or landmark. We’ll look up real mapped places around it.</p></div><div className="live-label"><span/> LIVE OPEN MAP DATA</div></div>
        <div className="search-panel">
          <div className="search-input location-input"><MapPin size={20}/><label>SEARCH A LOCATION<input value={locationInput} onChange={e => setLocationInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchAround()} placeholder="Try Margao, Panaji, Arambol..."/></label></div>
          <div className="search-input keyword-input"><Compass size={20}/><label>FILTER BY INTEREST<input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Beach, fort, church, waterfall..."/></label></div>
          <label className="radius-select"><span>RADIUS</span><select value={radius} onChange={e => setRadius(e.target.value)}><option value="5000">5 km</option><option value="10000">10 km</option><option value="20000">20 km</option><option value="30000">30 km</option></select></label>
          <button className="search-button" onClick={() => searchAround()} disabled={loading}>{loading ? <LoaderCircle className="spin"/> : <Search size={18}/>} {loading ? 'Searching' : 'Find nearby spots'}</button>
          <button className="locate-button" onClick={searchMyLocation} disabled={loading || usingLocation} title="Use my current location">{usingLocation ? <LoaderCircle className="spin"/> : <LocateFixed size={19}/>}</button>
        </div>
        <div className="search-hint"><span><i/> Search uses OpenStreetMap data</span><span>Allow location access to find places near you</span></div>

        {error && <div className="notice error"><MapPin size={17}/>{error}</div>}
        {searched && !loading && !error && <div className="results-heading"><div><span className="eyebrow">EXPLORE AROUND</span><h3>{location.name} <small>· {filtered.length} places found</small></h3><p>{location.display}</p></div><a href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lon}#map=12/${location.lat}/${location.lon}`} target="_blank" rel="noreferrer">View area map <ExternalLink size={14}/></a></div>}

        {searched && <div className="category-row">{categories.map(c => <button key={c} className={category === c ? 'category active' : 'category'} onClick={() => setCategory(c)}>{c}</button>)}</div>}

        {loading && <div className="loading-state"><LoaderCircle className="spin" size={30}/><strong>Finding places around {locationInput}...</strong><span>Checking live map data. This can take a few seconds.</span></div>}

        {searched && !loading && filtered.length > 0 && <div className="results-grid">
          {filtered.slice(0, 18).map(place => <PlaceCard key={place.id} place={place} saved={saved.some(p => p.id === place.id)} onSave={() => toggleSaved(place)}/>)}
        </div>}
        {searched && !loading && !error && filtered.length === 0 && <div className="empty-state"><Compass size={30}/><strong>No places match that filter.</strong><span>Try another keyword or category.</span></div>}
        {!searched && <div className="start-state"><div className="start-icon"><MapPin size={24}/></div><div><strong>Where should we explore?</strong><p>Try <button onClick={() => {setLocationInput('Margao, Goa'); searchAround('Margao, Goa');}}>Margao</button>, <button onClick={() => {setLocationInput('Panaji, Goa'); searchAround('Panaji, Goa');}}>Panaji</button>, <button onClick={() => {setLocationInput('Vasco da Gama, Goa'); searchAround('Vasco da Gama, Goa');}}>Vasco</button> or <button onClick={() => {setLocationInput('Arambol, Goa'); searchAround('Arambol, Goa');}}>Arambol</button>.</p></div></div>}
      </section>

      <section className="map-section section-wrap" id="map">
        <div className="section-heading"><div><span className="eyebrow">SEE WHERE IT TAKES YOU</span><h2>Goa, <em>on the map.</em></h2><p>Explore featured destinations or map the places you just searched.</p></div><a className="text-link" href="https://www.openstreetmap.org/#map=9/15.35/73.98" target="_blank" rel="noreferrer">Open full map <ArrowUpRight size={16}/></a></div>
        <div className="map-card">
          <div className="map-frame"><MapContainer center={[location.lat, location.lon]} zoom={searched ? 12 : 9} scrollWheelZoom={true} zoomControl={false} className="leaflet-map">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <ZoomControl position="bottomright"/>
            <FlyTo center={[location.lat, location.lon]} zoom={searched ? 12 : 9}/>
            {(searched && places.length ? places : featured).map(p => <CircleMarker key={p.id} center={[p.lat, p.lon]} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: p.kind === 'Heritage' ? '#ef7667' : '#087b76', fillOpacity: .95 }}>
              <Popup><div className="map-popup"><strong>{p.name}</strong><span>{p.area || p.kind}</span><a href={mapsUrl(p.lat, p.lon)} target="_blank" rel="noreferrer">Get directions ↗</a></div></Popup>
            </CircleMarker>)}
          </MapContainer></div>
          <aside className="map-aside"><span className="eyebrow">A FEW GOA FAVOURITES</span><h3>Worth the detour.</h3>{featured.slice(0, 5).map(p => <a className="map-favourite" key={p.id} href={mapsUrl(p.lat, p.lon)} target="_blank" rel="noreferrer"><span><MapPin size={15}/></span><div><strong>{p.name}</strong><small>{p.area}</small></div><ArrowUpRight size={16}/></a>)}<p>Map data and coordinates are provided by OpenStreetMap.</p></aside>
        </div>
      </section>

      <section className="recommended section-wrap">
        <div className="section-heading"><div><span className="eyebrow">THE GOA CLASSICS</span><h2>Places worth <em>the journey.</em></h2><p>A little inspiration while you decide where to go next.</p></div><a className="text-link" href="#discover">Search any area <ArrowUpRight size={16}/></a></div>
        <div className="recommend-grid">{featured.map((place, i) => <PlaceCard key={place.id} place={place} saved={saved.some(p => p.id === place.id)} onSave={() => toggleSaved(place)} featuredCard index={i}/>)}</div>
      </section>

      <section className="bottom-banner section-wrap"><div><span className="eyebrow light">TAKE THE SCENIC ROUTE</span><h2>Make room for<br/><em>one more detour.</em></h2><p>The best Goa days rarely follow a strict plan.</p><a className="btn coral" href="#discover">Find your next stop <ArrowUpRight size={17}/></a></div><Photo query="Goa tropical palm lined beach sunset" alt="Goa beach at sunset"/></section>

      <section className="saved-section section-wrap" id="saved"><div className="section-heading"><div><span className="eyebrow">YOUR LITTLE COLLECTION</span><h2>Saved <em>for later.</em></h2><p>Keep the places you want to come back to.</p></div><span className="saved-count"><Heart size={16}/>{saved.length} saved</span></div>
        {saved.length ? <div className="saved-chips">{saved.map(p => <div key={p.id}><span>{p.name}</span><button onClick={() => toggleSaved(p)} aria-label={`Remove ${p.name}`}><X size={14}/></button></div>)}</div> : <p className="no-saved">Tap the heart on a place to add it to your list.</p>}
      </section>
    </main>

    <footer className="footer"><a className="brand footer-brand" href="#top"><span className="brand-icon"><Sun size={22}/></span><span>SUSHEGAD TRAILS<span className="brand-dot">.</span><small>FIND YOUR GOA</small></span></a><p>A little guide to a place that stays with you. Made for the love of Goa.</p><div><a href="#discover">Discover</a><a href="#map">Map</a><a href="#inspiration">Inspiration</a></div><small>© 2026 SUSHEGAD TRAILS · MAP DATA © OPENSTREETMAP CONTRIBUTORS</small></footer>
    {toast && <div className="toast"><Sparkles size={16}/>{toast}<button onClick={() => setToast('')}><X size={14}/></button></div>}
  </div>;
}

function PlaceCard({ place, saved, onSave, featuredCard = false, index = 0 }) {
  const imageQuery = place.query || place.name;
  return <article className={`place-card ${featuredCard ? 'featured-card' : ''}`}>
    <div className="place-image"><Photo query={imageQuery} alt={place.name}/><span className="place-type">{place.kind || 'Place'}</span><button className={`save-button ${saved ? 'saved' : ''}`} onClick={onSave} aria-label={saved ? 'Remove saved place' : 'Save place'}><Heart size={17} fill={saved ? 'currentColor' : 'none'}/></button>{featuredCard && <span className="place-number">0{index + 1}</span>}</div>
    <div className="place-details"><div className="place-area"><MapPin size={13}/>{place.area || 'Around your search area'}</div><h3>{place.name}</h3><p>{place.note || 'Discover this place and explore the area around it.'}</p><div className="place-actions"><a href={mapsUrl(place.lat, place.lon)} target="_blank" rel="noreferrer">Directions <Navigation size={14}/></a>{place.osmId && <a href={osmUrl(place)} target="_blank" rel="noreferrer" className="source-link">OSM <ExternalLink size={12}/></a>}</div></div>
  </article>;
}

export default App;