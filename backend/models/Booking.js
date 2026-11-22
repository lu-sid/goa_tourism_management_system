
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            required: true,
            unique: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        bookingType: {
            type: String,
            enum: ["Hotel", "TourPackage"],
            required: true
        },

        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel"
        },

        tourPackage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TourPackage"
        },

        checkIn: {
            type: Date
        },

        checkOut: {
            type: Date
        },

        numberOfGuests: {
            type: Number,
            required: true,
            min: 1
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        bookingDate: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Cancelled",
                "Completed"
            ],
            default: "Pending"
        },

        specialRequests: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Booking",
    bookingSchema,
    "bookings"
);
