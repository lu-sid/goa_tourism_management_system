# Sushegad Goa — Goa Tourism Static Website

A responsive, frontend-only tourism website built with React, Vite, custom CSS, Lucide React icons, and React Leaflet / OpenStreetMap. It uses the requested palette:
- Teal Green `#006D6F`
- Turquoise `#3DBCA8`
- Sunshine Yellow `#FFC857`
- Coral `#FF6F61`
- Tropical Pink `#FF4D8D`

## Run locally

1. Install Node.js (LTS) if you don't already have it: https://nodejs.org/
2. Extract this folder and open a terminal inside it.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL Vite prints (usually `http://localhost:5173`).

## Build for deployment

```bash
npm run build
npm run preview
```

## What's included

- Custom Sushegad Goa logo made with SVG-style icon composition and typography
- Responsive navigation and mobile menu
- Hero banner and destination search/filter
- Interactive Goa map with destination markers, popups, category colours, and Google Maps directions
- Destination cards and save-to-favourites interactions
- Stay cards, experience categories, newsletter demo form, and footer
- Toast notifications for demo interactions
- Responsive layout for desktop, tablet, and mobile

## Important

This is a static frontend demo. Search/filter and saved-place state work in the browser, but there is no backend, real booking, authentication, live availability, or email subscription. Map coordinates are approximate demo locations. Map tiles require an internet connection and use OpenStreetMap. Some text, hotel names, and prices are sample content. Images load from Unsplash and therefore require internet access.

## UX improvements in this version

- Sort destinations by featured order, name, or region.
- Clear all active destination filters in one click.
- Open a saved-places side drawer with remove actions and an empty state.
- Add/remove destinations from a temporary trip-ideas list.
- Improved responsive filter controls, drawer overlay, and feedback states.

Trip ideas and saved places currently live in React state only and reset on refresh. Add localStorage or a backend if persistence is required.
