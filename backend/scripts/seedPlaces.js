const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const TouristPlace = require("../models/TouristPlace");

const places = [
    {
        name: "Baga Beach",
        description: "One of North Goa's most popular beaches, known for its lively shoreline, water sports, beach shacks and nightlife.",
        category: "Beach",
        location: { address: "Baga, Bardez, North Goa", latitude: 15.5553, longitude: 73.7517 },
        bestTimeToVisit: "November to February",
        isFeatured: true
    },
    {
        name: "Anjuna Beach",
        description: "A scenic North Goa beach famous for its rocky coastline, flea market, cafés and sunset views.",
        category: "Beach",
        location: { address: "Anjuna, Bardez, North Goa", latitude: 15.5736, longitude: 73.7400 },
        bestTimeToVisit: "November to February",
        isFeatured: true
    },
    {
        name: "Palolem Beach",
        description: "A beautiful crescent-shaped beach in South Goa, known for its calm atmosphere, palm-lined shore and scenic views.",
        category: "Beach",
        location: { address: "Palolem, Canacona, South Goa", latitude: 15.0100, longitude: 74.0232 },
        bestTimeToVisit: "November to March",
        isFeatured: true
    },
    {
        name: "Colva Beach",
        description: "A popular South Goa beach with a long stretch of white sand, coconut palms and a relaxed coastal atmosphere.",
        category: "Beach",
        location: { address: "Colva, Salcete, South Goa", latitude: 15.2798, longitude: 73.9225 },
        bestTimeToVisit: "October to March",
        isFeatured: false
    },
    {
        name: "Fort Aguada",
        description: "A historic Portuguese-era fort overlooking the Arabian Sea, with panoramic coastal views and a famous lighthouse.",
        category: "Historical",
        location: { address: "Sinquerim, Candolim, North Goa", latitude: 15.4920, longitude: 73.7730 },
        bestTimeToVisit: "October to March",
        isFeatured: true
    },
    {
        name: "Chapora Fort",
        description: "A hilltop fort offering sweeping views of the Chapora River and the surrounding coastline.",
        category: "Historical",
        location: { address: "Chapora, Vagator, North Goa", latitude: 15.6066, longitude: 73.7355 },
        bestTimeToVisit: "October to February",
        isFeatured: true
    },
    {
        name: "Basilica of Bom Jesus",
        description: "A UNESCO World Heritage Site renowned for its Baroque architecture and historic significance.",
        category: "Religious",
        location: { address: "Old Goa, North Goa", latitude: 15.5009, longitude: 73.9115 },
        bestTimeToVisit: "November to February",
        isFeatured: true
    },
    {
        name: "Se Cathedral",
        description: "A magnificent historic cathedral in Old Goa, celebrated for its Portuguese-Gothic architecture.",
        category: "Religious",
        location: { address: "Old Goa, North Goa", latitude: 15.5036, longitude: 73.9120 },
        bestTimeToVisit: "November to February",
        isFeatured: false
    },
    {
        name: "Dudhsagar Falls",
        description: "A spectacular multi-tiered waterfall surrounded by lush Western Ghats forest.",
        category: "Nature",
        location: { address: "Sonaulim, Goa", latitude: 15.3144, longitude: 74.3143 },
        bestTimeToVisit: "October to February",
        isFeatured: true
    },
    {
        name: "Cotigao Wildlife Sanctuary",
        description: "A peaceful forest sanctuary in South Goa known for its biodiversity, walking trails and natural surroundings.",
        category: "Nature",
        location: { address: "Cotigao, Canacona, South Goa", latitude: 14.9818, longitude: 74.1945 },
        bestTimeToVisit: "October to March",
        isFeatured: false
    },
    {
        name: "Panaji",
        description: "Goa's capital city, known for its colourful Latin Quarter, riverside promenade, heritage streets and cafés.",
        category: "Other",
        location: { address: "Panaji, North Goa", latitude: 15.4909, longitude: 73.8278 },
        bestTimeToVisit: "November to February",
        isFeatured: true
    },
    {
        name: "Margao",
        description: "A lively South Goa city with traditional markets, Portuguese-era heritage and a rich local food culture.",
        category: "Other",
        location: { address: "Margao, Salcete, South Goa", latitude: 15.2832, longitude: 73.9862 },
        bestTimeToVisit: "November to February",
        isFeatured: false
    }
];

async function seedPlaces() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    let created = 0;
    let updated = 0;

    for (const place of places) {
        const existing = await TouristPlace.findOne({ name: place.name });

        if (existing) {
            existing.set({
                ...place,
                status: "Active"
            });

            await existing.save();
            updated++;
        } else {
            await TouristPlace.create({
                ...place,
                status: "Active"
            });

            created++;
        }
    }

    console.log("\nDestination seeding completed.");
    console.log(`New destinations added: ${created}`);
    console.log(`Existing destinations updated: ${updated}`);
    console.log(`Total processed: ${places.length}`);
}

seedPlaces()
    .catch((error) => {
        console.error("Destination seeding failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
