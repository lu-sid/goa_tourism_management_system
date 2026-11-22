
const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
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

        cuisine: [{
            type: String
        }],

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

        averageCost: {
            type: Number,
            default: 0,
            min: 0
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
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

        contactNumber: {
            type: String,
            default: ""
        },

        menu: [{
            itemName: String,
            price: {
                type: Number,
                min: 0
            },
            category: String
        }],

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
    "Restaurant",
    restaurantSchema,
    "restaurants"
);
