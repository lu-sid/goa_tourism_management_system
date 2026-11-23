const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const hotelRoutes = require("./routes/hotelRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Global middleware
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
    res.send("Goa Tourism Management System Backend is Running!");
});

app.use("/api/hotels", hotelRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/feedback", feedbackRoutes);
// Handle undefined routes
app.use(notFound);

// Central error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

