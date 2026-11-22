
const mongoose = require("mongoose");

const tourPackageSchema = new mongoose.Schema(
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
                "Adventure",
                "Beach",
                "Heritage",
                "Nature",
                "Family",
                "Honeymoon",
                "Other"
            ],
            default: "Other"
        },

        duration: {
            days: {
                type: Number,
                required: true,
                min: 1
            },
            nights: {
                type: Number,
                default: 0,
                min: 0
            }
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        maxPeople: {
            type: Number,
            required: true,
            min: 1
        },

        destinations: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "TouristPlace"
        }],

        itinerary: [{
            day: Number,
            title: String,
            activities: [String]
        }],

        inclusions: [{
            type: String
        }],

        exclusions: [{
            type: String
        }],

        images: [{
            type: String
        }],

        startDate: {
            type: Date
        },

        endDate: {
            type: Date
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
    "TourPackage",
    tourPackageSchema,
    "tour_packages"
);