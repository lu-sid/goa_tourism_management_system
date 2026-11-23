const beachPhotos = [
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1400',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1000',
  'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1000',
];

const heritagePhotos = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000',
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1000',
];

const naturePhotos = [
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400',
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1000',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000',
];

const cityPhotos = [
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1400',
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1000',
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1000',
];

export const destinationGuideData = {
  'baga-beach': {
    photos: beachPhotos,
    bestTime: 'November to February',
    visitWindow: 'Late afternoon and evening are popular',
    entryInfo: 'No general beach entry ticket. Water sports and activities are charged separately.',
    thingsToDo: [
      'Enjoy the beach and Arabian Sea views',
      'Try available water sports with licensed operators',
      'Explore the beach shacks and local cafés',
      'Experience the lively evening atmosphere',
    ],
    tips: [
      'Check water-sport safety conditions before participating',
      'Carry sunscreen and drinking water',
      'Keep an eye on belongings in crowded areas',
    ],
  },

  'anjuna-beach': {
    photos: beachPhotos,
    bestTime: 'November to February',
    visitWindow: 'Morning for a quieter visit; sunset for coastal views',
    entryInfo: 'No general beach entry ticket. Individual activities may have charges.',
    thingsToDo: [
      'Explore the rocky coastline',
      'Enjoy the cafés and beachside restaurants',
      'Visit the Anjuna flea market when operating',
      'Watch the sunset over the Arabian Sea',
    ],
    tips: [
      'Wear comfortable footwear on rocky sections',
      'Check flea-market operating days before visiting',
      'Avoid swimming in rough sea conditions',
    ],
  },

  'palolem-beach': {
    photos: beachPhotos,
    bestTime: 'November to March',
    visitWindow: 'Early morning and sunset',
    entryInfo: 'No general beach entry ticket. Boat trips and activities may cost extra.',
    thingsToDo: [
      'Walk along the crescent-shaped shoreline',
      'Explore local cafés and beach huts',
      'Ask local operators about kayaking and boat trips',
      'Enjoy a peaceful sunset',
    ],
    tips: [
      'Book accommodation in advance during peak season',
      'Confirm boat-trip safety and prices locally',
      'Respect local beach and wildlife guidelines',
    ],
  },

  'colva-beach': {
    photos: beachPhotos,
    bestTime: 'November to February',
    visitWindow: 'Morning and late afternoon',
    entryInfo: 'No general beach entry ticket. Optional activities may be chargeable.',
    thingsToDo: [
      'Enjoy a long walk along the sandy beach',
      'Try local Goan food nearby',
      'Explore nearby villages and markets',
      'Relax and enjoy the coastal scenery',
    ],
    tips: [
      'Carry sun protection',
      'Check sea conditions before entering the water',
      'Keep the beach clean',
    ],
  },

  'fort-aguada': {
    photos: heritagePhotos,
    bestTime: 'November to February',
    visitWindow: 'Visit during daylight; confirm current monument timings',
    entryInfo: 'Access rules and any applicable charges should be checked locally.',
    thingsToDo: [
      'Explore the historic Portuguese fort',
      'Enjoy views of the Arabian Sea',
      'Discover the lighthouse area where access is permitted',
      'Take photographs of the surrounding coastline',
    ],
    tips: [
      'Wear comfortable walking shoes',
      'Carry water, especially on sunny days',
      'Follow restricted-area and monument rules',
    ],
  },

  'chapora-fort': {
    photos: heritagePhotos,
    bestTime: 'November to February',
    visitWindow: 'Early morning or before sunset',
    entryInfo: 'Check current access arrangements and local restrictions before visiting.',
    thingsToDo: [
      'Walk up to the fort ruins',
      'Enjoy panoramic coastal views',
      'Explore the surrounding landscape',
      'Photograph the coastline from permitted viewpoints',
    ],
    tips: [
      'The climb can be uneven; wear suitable shoes',
      'Avoid visiting during heavy rain',
      'Be careful near exposed edges',
    ],
  },

  'basilica-bom-jesus': {
    photos: heritagePhotos,
    bestTime: 'October to February',
    visitWindow: 'Check current church visiting hours before arrival',
    entryInfo: 'Check official visitor guidance for current access arrangements.',
    thingsToDo: [
      'Admire the Baroque architecture',
      'Explore the historic church interiors where permitted',
      'Learn about the heritage of Old Goa',
      'Visit nearby heritage landmarks',
    ],
    tips: [
      'Dress respectfully',
      'Photography may be restricted in certain areas',
      'Keep noise to a minimum during services',
    ],
  },

  'se-cathedral': {
    photos: heritagePhotos,
    bestTime: 'October to February',
    visitWindow: 'Check current visiting hours before arrival',
    entryInfo: 'Check current visitor and service arrangements before visiting.',
    thingsToDo: [
      'Explore the historic cathedral architecture',
      'Admire the interiors where access is permitted',
      'Discover the heritage precinct of Old Goa',
      'Combine the visit with nearby historic churches',
    ],
    tips: [
      'Dress respectfully',
      'Be mindful of religious services',
      'Follow photography restrictions',
    ],
  },

  'dudhsagar-falls': {
    photos: naturePhotos,
    bestTime: 'Post-monsoon to early winter, subject to access conditions',
    visitWindow: 'Plan a daytime visit and confirm transport arrangements',
    entryInfo: 'Transport, permits and access charges may apply depending on the route.',
    thingsToDo: [
      'Enjoy views of the spectacular waterfall',
      'Explore permitted nature viewpoints',
      'Experience the surrounding Western Ghats landscape',
      'Take photographs from designated safe areas',
    ],
    tips: [
      'Confirm whether access is open before travelling',
      'Use authorised transport and guides where required',
      'Never enter restricted water areas',
      'Avoid unsafe routes during heavy rain',
    ],
  },

  'cotigao-sanctuary': {
    photos: naturePhotos,
    bestTime: 'October to March',
    visitWindow: 'Daytime; confirm sanctuary entry timings',
    entryInfo: 'Entry permissions and applicable fees should be checked with the forest department.',
    thingsToDo: [
      'Explore permitted nature trails',
      'Look for birds and local wildlife from a safe distance',
      'Experience the forest landscape',
      'Visit designated observation areas where available',
    ],
    tips: [
      'Follow forest department instructions',
      'Do not feed or disturb wildlife',
      'Wear comfortable walking shoes',
      'Carry drinking water',
    ],
  },

  'panaji': {
    photos: cityPhotos,
    bestTime: 'November to February',
    visitWindow: 'Morning for heritage walks; evening for riverside views',
    entryInfo: 'Individual attractions may have their own timings and charges.',
    thingsToDo: [
      'Explore the colourful Fontainhas neighbourhood',
      'Walk along the Mandovi riverfront',
      'Discover local cafés and restaurants',
      'Explore markets and heritage buildings',
    ],
    tips: [
      'Explore Fontainhas on foot',
      'Respect residential areas when taking photographs',
      'Check attraction timings before planning your day',
    ],
  },

  'margao': {
    photos: cityPhotos,
    bestTime: 'November to February',
    visitWindow: 'Morning for markets and daytime sightseeing',
    entryInfo: 'Individual attractions may have their own timings and charges.',
    thingsToDo: [
      'Explore the traditional market areas',
      'Discover Goan food and local bakeries',
      'Visit nearby heritage sites',
      'Experience everyday life in South Goa',
    ],
    tips: [
      'Visit markets earlier in the day',
      'Carry cash for small local purchases',
      'Be mindful of traffic around busy market areas',
    ],
  },
};
