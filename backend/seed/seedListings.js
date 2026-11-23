const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const Hotel = require("../models/Hotel");
const Restaurant = require("../models/Restaurant");

const hotels = [
    {
        name: "Coastal Palm Retreat (Demo)",
        description: "A tropical-style sample resort near the lively beaches of North Goa.",
        category: "Resort",
        location: { address: "Near Calangute Beach, Calangute, Goa", city: "Calangute" },
        pricePerNight: 4500,
        rating: 4.5,
        amenities: ["Swimming Pool", "Wi-Fi", "Restaurant", "Air Conditioning", "Parking"],
        images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200"],
        totalRooms: 30,
        availableRooms: 18,
        status: "Active"
    },
    {
        name: "The Azure Bay Villa (Demo)",
        description: "A sample luxury villa concept with spacious rooms and a relaxed coastal atmosphere.",
        category: "Villa",
        location: { address: "Near Anjuna Beach, Anjuna, Goa", city: "Anjuna" },
        pricePerNight: 8500,
        rating: 4.8,
        amenities: ["Private Pool", "Wi-Fi", "Garden", "Kitchen", "Parking"],
        images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200"],
        totalRooms: 8,
        availableRooms: 4,
        status: "Active"
    },
    {
        name: "Mandovi Riverside Stay (Demo)",
        description: "A sample city stay concept overlooking the scenic surroundings of Panaji.",
        category: "Luxury",
        location: { address: "Near Mandovi River, Panaji, Goa", city: "Panaji" },
        pricePerNight: 6200,
        rating: 4.6,
        amenities: ["River View", "Wi-Fi", "Restaurant", "Gym", "Parking"],
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"],
        totalRooms: 45,
        availableRooms: 20,
        status: "Active"
    },
    {
        name: "South Shore Beach Resort (Demo)",
        description: "A sample beachside resort concept for a peaceful South Goa holiday.",
        category: "Resort",
        location: { address: "Near Colva Beach, Colva, Goa", city: "Colva" },
        pricePerNight: 5200,
        rating: 4.4,
        amenities: ["Swimming Pool", "Beach Access", "Spa", "Wi-Fi", "Restaurant"],
        images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200"],
        totalRooms: 40,
        availableRooms: 22,
        status: "Active"
    },
    {
        name: "Palolem Serenity Cottages (Demo)",
        description: "A sample cottage stay inspired by the laid-back atmosphere of Palolem.",
        category: "Homestay",
        location: { address: "Near Palolem Beach, Canacona, Goa", city: "Canacona" },
        pricePerNight: 2800,
        rating: 4.3,
        amenities: ["Garden", "Wi-Fi", "Restaurant", "Air Conditioning"],
        images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200"],
        totalRooms: 12,
        availableRooms: 7,
        status: "Active"
    },
    {
        name: "Baga Sands Hotel (Demo)",
        description: "A sample budget-friendly stay concept close to the popular Baga area.",
        category: "Budget",
        location: { address: "Near Baga Beach, Baga, Goa", city: "Baga" },
        pricePerNight: 2200,
        rating: 4.1,
        amenities: ["Wi-Fi", "Air Conditioning", "Breakfast", "Parking"],
        images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200"],
        totalRooms: 25,
        availableRooms: 13,
        status: "Active"
    },
    {
        name: "Candolim Heritage Suites (Demo)",
        description: "A sample boutique accommodation concept near Candolim's coastal attractions.",
        category: "Luxury",
        location: { address: "Near Candolim Beach, Candolim, Goa", city: "Candolim" },
        pricePerNight: 6800,
        rating: 4.7,
        amenities: ["Swimming Pool", "Spa", "Wi-Fi", "Restaurant", "Bar"],
        images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200"],
        totalRooms: 32,
        availableRooms: 15,
        status: "Active"
    },
    {
        name: "Vagator Cliffside Retreat (Demo)",
        description: "A sample boutique retreat concept inspired by Vagator's dramatic coastline.",
        category: "Resort",
        location: { address: "Near Vagator Beach, Vagator, Goa", city: "Vagator" },
        pricePerNight: 5700,
        rating: 4.5,
        amenities: ["Sea View", "Pool", "Wi-Fi", "Restaurant", "Parking"],
        images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200"],
        totalRooms: 28,
        availableRooms: 11,
        status: "Active"
    },
    {
        name: "Dona Paula Bay Residence (Demo)",
        description: "A sample premium residence concept with views towards the Arabian Sea.",
        category: "Villa",
        location: { address: "Near Dona Paula, Panaji, Goa", city: "Panaji" },
        pricePerNight: 7500,
        rating: 4.6,
        amenities: ["Sea View", "Kitchen", "Wi-Fi", "Private Balcony", "Parking"],
        images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"],
        totalRooms: 6,
        availableRooms: 3,
        status: "Active"
    },
    {
        name: "Agonda Quiet Escape (Demo)",
        description: "A sample nature-inspired stay concept near the quieter Agonda coastline.",
        category: "Homestay",
        location: { address: "Near Agonda Beach, Agonda, Goa", city: "Agonda" },
        pricePerNight: 3200,
        rating: 4.4,
        amenities: ["Garden", "Wi-Fi", "Breakfast", "Beach Access"],
        images: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200"],
        totalRooms: 10,
        availableRooms: 6,
        status: "Active"
    }
];

const restaurants = [
    {
        name: "The Konkan Table (Demo)",
        description: "A sample restaurant concept celebrating traditional coastal Goan flavours.",
        cuisine: ["Goan", "Seafood", "Indian"],
        location: { address: "Near Calangute Beach, Calangute, Goa", city: "Calangute" },
        averageCost: 900,
        rating: 4.5,
        openingTime: "11:00 AM",
        closingTime: "11:00 PM",
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"],
        menu: [
            { itemName: "Goan Fish Curry", price: 350, category: "Main Course" },
            { itemName: "Prawn Balchao", price: 420, category: "Seafood" },
            { itemName: "Bebinca", price: 180, category: "Dessert" }
        ],
        status: "Active"
    },
    {
        name: "Seaside Spice Kitchen (Demo)",
        description: "A sample coastal dining concept with seafood and regional specialities.",
        cuisine: ["Seafood", "Goan", "Continental"],
        location: { address: "Near Baga Beach, Baga, Goa", city: "Baga" },
        averageCost: 1200,
        rating: 4.6,
        openingTime: "12:00 PM",
        closingTime: "11:30 PM",
        images: ["https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200"],
        menu: [
            { itemName: "Grilled Fish", price: 550, category: "Seafood" },
            { itemName: "Butter Garlic Prawns", price: 480, category: "Seafood" },
            { itemName: "Chocolate Brownie", price: 220, category: "Dessert" }
        ],
        status: "Active"
    },
    {
        name: "Mango Leaf Bistro (Demo)",
        description: "A sample casual dining concept serving Indian and international favourites.",
        cuisine: ["Indian", "Continental", "Vegetarian"],
        location: { address: "Near Anjuna Market, Anjuna, Goa", city: "Anjuna" },
        averageCost: 750,
        rating: 4.3,
        openingTime: "09:00 AM",
        closingTime: "10:30 PM",
        images: ["https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200"],
        menu: [
            { itemName: "Paneer Tikka", price: 280, category: "Starter" },
            { itemName: "Vegetable Pasta", price: 320, category: "Main Course" },
            { itemName: "Fresh Lime Soda", price: 100, category: "Beverage" }
        ],
        status: "Active"
    },
    {
        name: "Palolem Sunset Café (Demo)",
        description: "A sample beach café concept inspired by relaxed South Goa sunsets.",
        cuisine: ["Continental", "Goan", "Cafe"],
        location: { address: "Near Palolem Beach, Canacona, Goa", city: "Canacona" },
        averageCost: 650,
        rating: 4.4,
        openingTime: "08:00 AM",
        closingTime: "10:00 PM",
        images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200"],
        menu: [
            { itemName: "Goan Sausage Roll", price: 260, category: "Snack" },
            { itemName: "Grilled Sandwich", price: 220, category: "Cafe" },
            { itemName: "Pancakes", price: 240, category: "Breakfast" }
        ],
        status: "Active"
    },
    {
        name: "The Spice Courtyard (Demo)",
        description: "A sample restaurant concept featuring Indian dishes and Goan-inspired flavours.",
        cuisine: ["Indian", "Goan", "North Indian"],
        location: { address: "Near Panaji Market, Panaji, Goa", city: "Panaji" },
        averageCost: 850,
        rating: 4.5,
        openingTime: "11:30 AM",
        closingTime: "10:30 PM",
        images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200"],
        menu: [
            { itemName: "Chicken Xacuti", price: 390, category: "Main Course" },
            { itemName: "Mushroom Xacuti", price: 300, category: "Main Course" },
            { itemName: "Sol Kadhi", price: 90, category: "Beverage" }
        ],
        status: "Active"
    },
    {
        name: "Candolim Garden Café (Demo)",
        description: "A sample garden café concept for relaxed meals and coffee.",
        cuisine: ["Cafe", "Continental", "Italian"],
        location: { address: "Near Candolim Beach, Candolim, Goa", city: "Candolim" },
        averageCost: 700,
        rating: 4.2,
        openingTime: "08:30 AM",
        closingTime: "10:00 PM",
        images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200"],
        menu: [
            { itemName: "Margherita Pizza", price: 350, category: "Main Course" },
            { itemName: "Pesto Pasta", price: 390, category: "Main Course" },
            { itemName: "Cappuccino", price: 150, category: "Beverage" }
        ],
        status: "Active"
    },
    {
        name: "Vagator Coastal Kitchen (Demo)",
        description: "A sample dining concept combining coastal ingredients with contemporary dishes.",
        cuisine: ["Seafood", "Goan", "Asian"],
        location: { address: "Near Vagator Beach, Vagator, Goa", city: "Vagator" },
        averageCost: 1100,
        rating: 4.6,
        openingTime: "12:00 PM",
        closingTime: "11:00 PM",
        images: ["https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?w=1200"],
        menu: [
            { itemName: "Prawn Curry Rice", price: 420, category: "Main Course" },
            { itemName: "Fish Fry", price: 380, category: "Seafood" },
            { itemName: "Caramel Custard", price: 160, category: "Dessert" }
        ],
        status: "Active"
    },
    {
        name: "Margao Heritage Kitchen (Demo)",
        description: "A sample local dining concept inspired by the food culture of South Goa.",
        cuisine: ["Goan", "Indian", "Vegetarian"],
        location: { address: "Near Margao Market, Margao, Goa", city: "Margao" },
        averageCost: 550,
        rating: 4.3,
        openingTime: "09:00 AM",
        closingTime: "09:30 PM",
        images: ["https://images.unsplash.com/photo-1547592180-85f173990554?w=1200"],
        menu: [
            { itemName: "Veg Thali", price: 180, category: "Thali" },
            { itemName: "Fish Thali", price: 280, category: "Thali" },
            { itemName: "Poi with Bhaji", price: 120, category: "Breakfast" }
        ],
        status: "Active"
    },
    {
        name: "Dona Paula View Café (Demo)",
        description: "A sample café concept for light meals and scenic coastal views.",
        cuisine: ["Cafe", "Continental", "Desserts"],
        location: { address: "Near Dona Paula Jetty, Panaji, Goa", city: "Panaji" },
        averageCost: 800,
        rating: 4.4,
        openingTime: "08:00 AM",
        closingTime: "10:00 PM",
        images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200"],
        menu: [
            { itemName: "Waffles", price: 260, category: "Dessert" },
            { itemName: "Club Sandwich", price: 290, category: "Cafe" },
            { itemName: "Cold Coffee", price: 170, category: "Beverage" }
        ],
        status: "Active"
    },
    {
        name: "Agonda Village Kitchen (Demo)",
        description: "A sample village-style restaurant concept featuring simple coastal meals.",
        cuisine: ["Goan", "Seafood", "Indian"],
        location: { address: "Near Agonda Beach, Agonda, Goa", city: "Agonda" },
        averageCost: 600,
        rating: 4.2,
        openingTime: "08:30 AM",
        closingTime: "10:00 PM",
        images: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=1200"],
        menu: [
            { itemName: "Prawn Fried Rice", price: 320, category: "Main Course" },
            { itemName: "Goan Vegetable Curry", price: 220, category: "Main Course" },
            { itemName: "Fresh Lime Water", price: 80, category: "Beverage" }
        ],
        status: "Active"
    }
];

async function seedListings() {
    try {
        const mongoUri =
            process.env.MONGO_URI ||
            "mongodb://127.0.0.1:27017/goa_tourism";

        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB.");

        for (const hotel of hotels) {
            await Hotel.updateOne(
                { name: hotel.name },
                { $set: hotel },
                { upsert: true, runValidators: true }
            );
        }

        for (const restaurant of restaurants) {
            await Restaurant.updateOne(
                { name: restaurant.name },
                { $set: restaurant },
                { upsert: true, runValidators: true }
            );
        }

        const hotelCount = await Hotel.countDocuments({ status: "Active" });
        const restaurantCount = await Restaurant.countDocuments({ status: "Active" });

        console.log("\nSeed completed successfully!");
        console.log(`Active hotels in database: ${hotelCount}`);
        console.log(`Active restaurants in database: ${restaurantCount}`);
        console.log("\nThese are demonstration listings, not verified business records.");
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedListings();
