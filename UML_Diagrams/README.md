# Goa Tourism System UML diagrams

These diagrams describe the code currently present in this repository as inspected on 22 November 2026. They distinguish the implemented React discovery demo from tourism domain schemas that have no wired API behavior.

## Project findings that govern the diagrams

- The React/Vite application provides typed-location search, optional browser geolocation, radius selection, keyword/category filtering, place cards, a Leaflet map, OpenStreetMap directions, and save/remove places in React state. It fetches Nominatim, Overpass, and Wikimedia Commons directly from the browser.
- `backend/server.js` configures CORS, JSON parsing, MongoDB connection, and `GET /` only. It does not mount any router. The route, controller, and middleware JavaScript files are empty.
- The backend has nine Mongoose schemas: User, TouristPlace, Hotel, Restaurant, TourPackage, Booking, Payment, Review, and Feedback. These show data planned for a fuller tourism system; they do not implement registration, booking, payment, moderation, feedback, or administration behavior.
- `Booking.status` accepts Pending, Confirmed, Cancelled, and Completed and defaults to Pending. No code defines state transitions. `Payment.status` is a separate schema enum; no payment provider is integrated.
- No inheritance is defined by the source schemas. Associations in the class diagram represent Mongoose `ref` fields and arrays. `Review.targetType` + `targetId` is polymorphic, not a direct foreign-key association.

## Contents

| Folder | Diagram purpose |
| --- | --- |
| `Use_Case_Diagram/` | Separates implemented tourist discovery use cases and external map services from requested but unimplemented tourism features. |
| `Class_Diagram/` | Details all nine MongoDB model schemas and their references, plus the implemented frontend discovery client concept. |
| `State_Diagram/` | Shows the allowed Booking status values and Pending default without inventing unsupported transitions. |
| `Activity_Diagram/` | Follows the implemented place discovery workflow, including typed search versus GPS, result/no-result paths, filtering, saving, and directions. |
| `Sequence_Diagram/` | Shows the actual browser calls to geocoding and nearby-place services and rendering/directions. The backend, database, and payment service are explicitly absent from this sequence. |

Each folder contains `.svg` and `.png` visual exports plus an `.xmi` semantic model. SVG is suitable for viewing and insertion into a report; PNG is used as a high-resolution raster fallback. XMI is UML 1.4 / XMI 1.2 and intended for ArgoUML model import and editing. The compiled academic report is `Goa_Tourism_UML_Documentation.docx` in this folder.

## Open in ArgoUML

1. Start ArgoUML and choose **File → Import XMI...** (menu placement can vary by release).
2. Select the `.xmi` file in the diagram folder.
3. Save the imported model as a project if you want to continue editing it.
4. To view the ready-laid-out diagram, open the matching `.svg` in a browser or vector editor. XMI versions before UML 2.0 do not carry diagram layout, so ArgoUML imports the UML model elements but does not reconstruct the SVG layout automatically. Arrange the imported elements in an ArgoUML diagram as needed.

ArgoUML documentation describes XMI 1.0/1.1/1.2 import and notes that imported XMI contains model data without diagram layout. I could not run an ArgoUML application in this environment, so the files were checked for XML well-formedness and SVG parseability, not opened in the ArgoUML GUI. See the [ArgoUML manual: Import XMI](https://www.lysator.liu.se/xenofarm/argouml/work/argouml/www/documentation/printablehtml/manual/argomanual.html) and [ArgoUML FAQ](https://www.lysator.liu.se/xenofarm/argouml/work/argouml/www/faqs/users.html).

## Accuracy and scope notes

- The use-case XMI includes planned functionality as labeled use-case entries; the visual distinguishes those in amber. No unsupported include/extend edges are claimed.
- Booking status values in the state diagram are schema possibilities, not demonstrated transitions. Implement transition behavior only after the application has corresponding routes/controllers.
- The activity and sequence diagrams document the current discovery UI. There is no implemented end-to-end booking workflow to diagram yet.
- Class fields follow the Mongoose definitions, with nested schemas summarized as embedded objects/arrays for readability. Schema-generated persistence behavior is not represented as hand-written domain methods.
- The project README calls the site a static frontend demo and confirms saved places reset on refresh; this matches the React code.
