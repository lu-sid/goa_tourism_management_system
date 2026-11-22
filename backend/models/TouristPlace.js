
const mongoose = require("mongoose");

const touristPlaceSchema = new mongoose.Schema(
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
                "Beach",
                "Historical",
                "Religious",
                "Nature",
                "Adventure",
                "Other"
            ],
            default: "Other"
        },

        location: {
            address: {
                type: String,
                required: true
            },
            latitude: {
                type: Number
            },
            longitude: {
                type: Number
            }
        },

        entryFee: {
            type: Number,
            default: 0
        },

        openingTime: {
            type: String,
            default: ""
        },

        closingTime: {
            type: String,
            default: ""
        },

        images: [{
            type: String
        }],

        bestTimeToVisit: {
            type: String,
            default: ""
        },

        isFeatured: {
            type: Boolean,
            default: false
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
    "TouristPlace",
    touristPlaceSchema,
    "tourist_places"
);
