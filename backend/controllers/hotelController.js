
const Hotel = require("../models/Hotel");

// Get all active hotels
const getAllHotels = async (req, res, next) => {
    try {
        const { search, city, category, minPrice, maxPrice } = req.query;

        const filter = { status: "Active" };

        if (category) filter.category = category;

        if (city) {
            filter["location.city"] = {
                $regex: city,
                $options: "i"
            };
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { "location.city": { $regex: search, $options: "i" } }
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.pricePerNight = {};

            if (minPrice !== undefined) {
                filter.pricePerNight.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.pricePerNight.$lte = Number(maxPrice);
            }
        }

        const hotels = await Hotel.find(filter);

        res.status(200).json({
            success: true,
            count: hotels.length,
            hotels
        });

    } catch (error) {
        next(error);
    }
};

// Get hotel by ID
const getHotelById = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found."
            });
        }

        res.status(200).json({
            success: true,
            hotel
        });

    } catch (error) {
        next(error);
    }
};

// Create hotel (Admin)
const createHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Hotel added successfully.",
            hotel
        });

    } catch (error) {
        next(error);
    }
};

// Update hotel (Admin)
const updateHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Hotel updated successfully.",
            hotel
        });

    } catch (error) {
        next(error);
    }
};

// Delete hotel (Admin)
const deleteHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Hotel deleted successfully."
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel
};