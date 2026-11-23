
export const APP_NAME = "Sushegado Trails";

export const APP_TAGLINE = "Find your own slice of Goa.";

export const API_BASE_URL = "http://localhost:5000/api";

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const PLACE_CATEGORIES = [
  "Beaches",
  "Forts",
  "Churches",
  "Temples",
  "Waterfalls",
  "Nature",
  "Heritage",
  "Adventure",
  "Nightlife",
];

export const RESTAURANT_CATEGORIES = [
  "Goan",
  "Seafood",
  "North Indian",
  "South Indian",
  "Continental",
  "Italian",
  "Cafe",
  "Asian",
];

export const HOTEL_CATEGORIES = [
  "Luxury Resort",
  "Beach Resort",
  "Boutique Hotel",
  "Budget Stay",
  "Villa",
  "Homestay",
];

export const BOOKING_STATUSES = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export const PAYMENT_STATUSES = {
  PENDING: "Pending",
  SUCCESS: "Success",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const REVIEW_STATUSES = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const FEEDBACK_STATUSES = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/places" },
  { label: "Hotels", path: "/hotels" },
  { label: "Restaurants", path: "/restaurants" },
  { label: "Packages", path: "/packages" },
  { label: "About", path: "/about" },
];

export const GOA_MAP_DEFAULTS = {
  latitude: 15.2993,
  longitude: 74.124,
  zoom: 9,
};

export const CURRENCY = {
  code: "INR",
  locale: "en-IN",
  symbol: "₹",
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
};

export const STORAGE_KEYS = {
  TOKEN: "sushegado_token",
  USER: "sushegado_user",
  WISHLIST: "sushegado_wishlist",
};
