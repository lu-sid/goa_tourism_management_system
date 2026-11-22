
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        targetType: {
            type: String,
            enum: [
                "TouristPlace",
                "Hotel",
                "Restaurant",
                "TourPackage"
            ],
            required: true
        },

        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            required: true,
            trim: true
        },

        images: [{
            type: String
        }],

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Review",
    reviewSchema,
    "reviews"
);
