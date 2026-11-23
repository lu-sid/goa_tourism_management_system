# ArgoUML 0.34 manual diagram creation guide

## Scope and current status

ArgoUML 0.34 was launched from `C:\Users\Siddhi\Downloads\ArgoUML-0.34\argouml-0.34` under Java 17. The window can be inspected, but GUI input injection in this environment did not reliably reach the diagram canvas. No diagram was created or validated in ArgoUML during this attempt. The existing SVG, PNG, XMI, and DOCX files in this folder are not verified ArgoUML-created outputs; do not use them as evidence of native diagrams. This guide is for creating the requested diagrams interactively in the actual application.

The source inspection found that the current React page implements live place discovery, place browsing, map display, directions, and save/remove in in-memory React state. The backend defines nine Mongoose schemas, but `server.js` mounts no routers and the route/controller files are empty. Registration, login, bookings, payments, reviews, feedback submission, and administration are not implemented workflows. The `Booking` and `Payment` status enums are data fields only; no lifecycle transitions or payment integration exist.

## Start a native ArgoUML project

1. Launch `argouml.bat` from the ArgoUML 0.34 installation directory. Keep all distribution JARs in place.
2. In ArgoUML choose **File > New Project** (or continue from the empty Untitled project), then **File > Save Project As**. Save a native `.zargo` project in `UML_Diagrams`, for example `Goa_Tourism_ArgoUML.zargo`.
3. Make one model and create five diagrams in it. Use **Create** and the diagram submenu for the relevant type. Name them `Use Case - Implemented Discovery`, `Class - Backend Schemas`, `State - Conceptual Booking`, `Activity - Place Discovery`, and `Sequence - Place Discovery`.
4. Save often with **File > Save Project**. The native project should contain the diagram presentation/layout as well as model elements. Export each selected diagram from ArgoUML using its diagram export/print action. Reopen the saved `.zargo` before treating it as validated.

## 1. Use Case Diagram — create and validate this one first

### Boundary and actors

Set the system boundary title to **Goa Tourism Website — implemented discovery demo**. Add actor **Visitor / Tourist**. Add external actors **Nominatim geocoder**, **Overpass map data**, and **Wikimedia Commons** only if the corresponding calls are visible in the implementation. Do not add an Administrator actor as an implemented actor: no admin UI or API is wired.

### Implemented use cases

Place these use cases inside the boundary and connect Visitor / Tourist to each applicable one:

- Search around a typed location
- Find places near current location (browser geolocation)
- Browse / view place results
- Filter results by keyword and category
- View places on the map
- Save a place
- Remove a saved place
- Open directions in Google Maps
- Open a place in OpenStreetMap (only for results carrying an OSM identifier)

Connect **Search around a typed location** to Nominatim geocoder (location lookup) and Overpass map data (nearby places); connect **Find places near current location** to the browser geolocation facility and Overpass map data. Connect place image lookup to Wikimedia Commons only if you choose to show that UI detail. Use ordinary associations for actor-to-use-case links. Do not use `include`/`extend` unless you model a real shared/optional behavior and can justify the direction; ordinary associations are sufficient for this system.

Add a visually distinct note (for example, a UML note with a dashed anchor) headed **Planned / not implemented**. List registration, login, destination/hotel/restaurant/package management, booking, payment, booking history, reviews, feedback submission, and administration there. These are not implemented use cases. If you decide to draw them as use-case ovals, put the stereotype `«planned»` in every name and do not connect them as working behavior. Do not present Administrator as an implemented actor.

### Layout and check

Keep Visitor on the left, external services on the right, and the system boundary in the center. Place discovery/search use cases in the upper half and save/directions/map use cases below. Keep the planned note outside the boundary. Check every implemented oval against `src/App.jsx`; keep the distinction between live external map calls and backend persistence clear. Save the `.zargo`, close it, reopen it in ArgoUML, select this named diagram in the navigator, and confirm the shapes and labels remain editable. Export its image from ArgoUML before proceeding.

## 2. Class Diagram — nine backend schemas

Create nine UML classes and mark each with `«Mongoose schema»`. These are data schemas, not implemented controller/service classes. Use private (`-`) attributes. Do not invent operations; show **no domain operations**. Mongoose's generic persistence methods are framework behavior, not methods authored by this application. Use UML primitive/type names such as `String`, `Number`, `Boolean`, `Date`, `ObjectId`, and `String[]`; annotate nested structures and enums in braces or notes. Include `createdAt` and `updatedAt` on each class as `{timestamps}` rather than repeating them as authored fields.

- **User** (`users`): `- name: String`, `- email: String {unique}`, `- password: String`, `- phone: String`, `- role: String {tourist, admin; default tourist}`.
- **TouristPlace** (`tourist_places`): `- name: String`, `- description: String`, `- category: String {Beach, Historical, Religious, Nature, Adventure, Other}`, `- location: {address: String, latitude: Number, longitude: Number}`, `- entryFee: Number`, `- openingTime: String`, `- closingTime: String`, `- images: String[]`, `- bestTimeToVisit: String`, `- isFeatured: Boolean`, `- status: String {Active, Inactive}`.
- **Hotel** (`hotels`): `- name: String`, `- description: String`, `- category: String {Luxury, Resort, Budget, Homestay, Villa, Other}`, `- location: {address: String, city: String}`, `- pricePerNight: Number`, `- rating: Number`, `- amenities: String[]`, `- images: String[]`, `- contactNumber: String`, `- email: String`, `- totalRooms: Number`, `- availableRooms: Number`, `- status: String {Active, Inactive}`.
- **Restaurant** (`restaurants`): `- name: String`, `- description: String`, `- cuisine: String[]`, `- location: {address: String, city: String}`, `- averageCost: Number`, `- rating: Number`, `- openingTime: String`, `- closingTime: String`, `- images: String[]`, `- contactNumber: String`, `- menu: MenuItem[] {itemName, price, category}`, `- status: String {Active, Inactive}`.
- **TourPackage** (`tour_packages`): `- name: String`, `- description: String`, `- category: String {Adventure, Beach, Heritage, Nature, Family, Honeymoon, Other}`, `- duration: {days: Number, nights: Number}`, `- price: Number`, `- maxPeople: Number`, `- destinations: ObjectId[]`, `- itinerary: ItineraryDay[] {day, title, activities}`, `- inclusions: String[]`, `- exclusions: String[]`, `- images: String[]`, `- startDate: Date`, `- endDate: Date`, `- status: String {Active, Inactive}`.
- **Booking** (`bookings`): `- bookingId: String {unique}`, `- user: ObjectId`, `- bookingType: String {Hotel, TourPackage}`, `- hotel: ObjectId`, `- tourPackage: ObjectId`, `- checkIn: Date`, `- checkOut: Date`, `- numberOfGuests: Number`, `- totalAmount: Number`, `- bookingDate: Date`, `- status: String {Pending, Confirmed, Cancelled, Completed}`, `- specialRequests: String`.
- **Review** (`reviews`): `- user: ObjectId`, `- targetType: String {TouristPlace, Hotel, Restaurant, TourPackage}`, `- targetId: ObjectId`, `- rating: Number`, `- comment: String`, `- images: String[]`, `- status: String {Pending, Approved, Rejected}`.
- **Feedback** (`feedback`): `- user: ObjectId`, `- name: String`, `- email: String`, `- subject: String`, `- message: String`, `- category: String {Website, Booking, Destination, Hotel, Restaurant, Other}`, `- status: String {New, In Progress, Resolved}`, `- adminResponse: String`.
- **Payment** (`payments`): `- paymentId: String {unique}`, `- booking: ObjectId`, `- user: ObjectId`, `- amount: Number`, `- currency: String`, `- paymentMethod: String {UPI, Card, NetBanking, Wallet, Other}`, `- transactionId: String`, `- paymentGateway: String`, `- status: String {Pending, Successful, Failed, Refunded}`, `- paymentDate: Date`.

Draw associations only for actual schema `ref` fields: `User 1 — 0..* Booking` (Booking.user), `Hotel 0..1 — 0..* Booking` (Booking.hotel), `TourPackage 0..1 — 0..* Booking` (Booking.tourPackage), `TouristPlace 0..* — 0..* TourPackage` (TourPackage.destinations), `User 1 — 0..* Review` (Review.user), `User 0..1 — 0..* Feedback` (Feedback.user), `Booking 1 — 0..* Payment` (Payment.booking), and `User 1 — 0..* Payment` (Payment.user). Multiplicities describe the reference fields and are not proof of database-enforced inverse navigation. Add a note that `Review.targetType + targetId` is polymorphic and cannot be represented as one ordinary typed association. Do not invent a Review-to-target association or inheritance. Add a prominent note: **Models exist; wired controllers/routes do not.**

Arrange classes in three rows: User and Booking in the center; booking-related Hotel, TourPackage, Payment nearby; place/review/feedback/restaurant around the perimeter. Keep relationship lines clear and multiplicities legible. If the complete attributes crowd the canvas, create a second detailed class diagram in the same project, split by model groups, while retaining the required nine-model overview.

## 3. State Diagram — explicitly conceptual, not implemented

There is no implemented stateful object lifecycle in the application. Booking has a `status` enum in its schema, but no route/controller creates or changes bookings. Create a state machine titled **Booking — conceptual lifecycle (not implemented)** and attach a note saying transitions are proposals inferred from the enum, not observed application behavior.

Use initial pseudostate -> **Pending**. Show proposed transitions `confirm` from Pending to **Confirmed**, `cancel` from Pending or Confirmed to **Cancelled**, and `complete` from Confirmed to **Completed**. Label every transition `proposed`. Do not include payment transitions: no payment component/integration exists. The schema also contains Payment status values, but there is no implemented Payment lifecycle. Do not imply that every enum transition is valid in current code.

## 4. Activity Diagram — implemented place discovery and saving

Title it **Place discovery and saved places (implemented frontend workflow)**. Model this flow:

1. Initial node -> visitor chooses typed location or current location.
2. Typed branch: enter location -> frontend requests Nominatim geocoding -> decision `location found?`; if no, show error and return to location entry; if yes, obtain coordinates.
3. Current-location branch: request browser geolocation -> decision `permission/location available?`; if no, show error and return to location choice; if yes, obtain coordinates.
4. Both branches join -> choose radius / optional keyword -> frontend requests nearby items from an Overpass endpoint -> decision `request succeeded?`; on failure show service error; on success map/filter results.
5. Decision `any matching places?`; no -> show empty result; yes -> show place cards and map.
6. Visitor may change category/keyword and filter displayed results; may choose a place and save or remove it. Show saved state update in React memory and a note `not persisted; resets when page state is lost`.
7. Visitor may open directions (external Google Maps) or an OSM item link in a new tab. End at visitor finishes discovery.

Use activity partitions **Visitor** and **React frontend**; optionally show **External map services** for Nominatim and Overpass. Do not add booking, payment, or database actions. Wikimedia Commons image retrieval can be shown as an optional external image request only if that request is confirmed in the current `Photo` component implementation.

## 5. Sequence Diagram — implemented frontend interactions

Title it **Place discovery in the React frontend (implemented)**. Lifelines: `Visitor`, `React App (src/App.jsx)`, `Browser Geolocation API`, `Nominatim`, `Overpass API`, `Google Maps / OpenStreetMap` (external destination, optional). Do not add Express API, Booking controller, Mongoose models, MongoDB, or Payment: the shown workflow does not call them.

Show chronological messages:

1. Visitor -> React App: enter location / choose Find nearby spots.
2. React App -> Nominatim: geocode query (typed-location path only); Nominatim -> React App: coordinates and display name, or empty/error response.
3. Alternative fragment `typed search` / `use my location`: in the latter, React App -> Browser Geolocation API: `getCurrentPosition`; API -> React App: coordinates or permission/error result.
4. React App -> Overpass API: POST nearby-place query with coordinates and radius; if an endpoint fails, show the retry to the next configured Overpass endpoint as a loop/alternative; Overpass -> React App: mapped elements or HTTP/error result.
5. React App: deduplicate/map results, apply keyword/category filters, render list/map. Visitor -> React App: change filter or tap save/remove. React App: update local React state. Add note `no backend/database write`.
6. Visitor -> React App: open directions / OSM source link; React App -> external map site: open URL in a new tab.

Add `alt` fragments for geocode failure, geolocation denied/unavailable, Overpass failure, no matching places, and results found. No server response or persistence response should appear.

## Final save, export, and validation checklist

- Ensure the Use Case diagram is completed, saved, closed, reopened, and checked first.
- Save one native `.zargo` with the five editable diagrams; save another copy before major edits if desired.
- Export each diagram from ArgoUML itself at a readable scale. Inspect every exported image for clipping, unreadable labels, and missing associations.
- Close and reopen the `.zargo` in ArgoUML 0.34. Verify all five diagram names appear in the navigator and each diagram opens with its shapes, connections, labels, and editable properties intact.
- Only after those checks, replace the old non-ArgoUML images in the deliverable and build the final Word document from the new ArgoUML exports. Until then, do not label the existing PNG/SVG/DOCX artifacts as actual ArgoUML output.
