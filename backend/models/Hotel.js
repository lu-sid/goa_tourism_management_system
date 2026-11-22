
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            enum: [
                "Luxury",
                "Resort",
                "Budget",
                "Homestay",
                "Villa",
                "Other"
            ],
            default: "Other"
        },

        location: {
            address: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            }
        },

        pricePerNight: {
            type: Number,
            required: true,
            min: 0
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },

        amenities: [{
            type: String
        }],

        images: [{
            type: String
        }],

        contactNumber: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            default: ""
        },

        totalRooms: {
            type: Number,
            default: 0
        },

        availableRooms: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Hotel",
    hotelSchema,
    "hotels"
);
