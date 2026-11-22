
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        paymentId: {
            type: String,
            required: true,
            unique: true
        },

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        currency: {
            type: String,
            default: "INR"
        },

        paymentMethod: {
            type: String,
            enum: [
                "UPI",
                "Card",
                "NetBanking",
                "Wallet",
                "Other"
            ],
            default: "Other"
        },

        transactionId: {
            type: String,
            default: ""
        },

        paymentGateway: {
            type: String,
            default: "Razorpay"
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Successful",
                "Failed",
                "Refunded"
            ],
            default: "Pending"
        },

        paymentDate: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Payment",
    paymentSchema,
    "payments"
);
