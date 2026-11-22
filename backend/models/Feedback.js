
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        subject: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        category: {
            type: String,
            enum: [
                "Website",
                "Booking",
                "Destination",
                "Hotel",
                "Restaurant",
                "Other"
            ],
            default: "Other"
        },

        status: {
            type: String,
            enum: ["New", "In Progress", "Resolved"],
            default: "New"
        },

        adminResponse: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Feedback",
    feedbackSchema,
    "feedback"
);
