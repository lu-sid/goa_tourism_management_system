require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

async function promoteAdmin() {
    const email = process.argv[2]?.trim().toLowerCase();

    if (!email) {
        console.error("Usage: node scripts/promoteAdmin.js user@example.com");
        process.exitCode = 1;
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ email });

    if (!user) {
        console.error("No account found for:", email);
        return;
    }

    user.role = "admin";
    await user.save();

    console.log("Admin role assigned successfully.");
    console.log("Account:", user.email);
    console.log("Name:", user.name);
    console.log("Please log out and log in again to refresh the account role.");
}

promoteAdmin()
    .catch(error => {
        console.error("Admin promotion failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });
