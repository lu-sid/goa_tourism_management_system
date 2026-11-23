const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

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

// Handle undefined routes
app.use(notFound);

// Central error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
