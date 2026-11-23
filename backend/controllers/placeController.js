
const TouristPlace = require("../models/TouristPlace");

// Get all active tourist places
const getAllPlaces = async (req, res, next) => {
    try {
        const { category, search, featured } = req.query;

        const filter = { status: "Active" };

        if (category) filter.category = category;

        if (featured === "true") filter.isFeatured = true;

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { "location.address": { $regex: search, $options: "i" } }
            ];
        }

        const places = await TouristPlace.find(filter).sort({
            isFeatured: -1,
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: places.length,
            places
        });

    } catch (error) {
        next(error);
    }
};

// Get one place
const getPlaceById = async (req, res, next) => {
    try {
        const place = await TouristPlace.findById(req.params.id);

        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Tourist place not found."
            });
        }

        res.status(200).json({
            success: true,
            place
        });

    } catch (error) {
        next(error);
    }
};

// Create place (Admin)
const createPlace = async (req, res, next) => {
    try {
        const place = await TouristPlace.create(req.body);

        res.status(201).json({
            success: true,
            message: "Tourist place added successfully.",
            place
        });

    } catch (error) {
        next(error);
    }
};

// Update place (Admin)
const updatePlace = async (req, res, next) => {
    try {
        const place = await TouristPlace.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Tourist place not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Tourist place updated successfully.",
            place
        });

    } catch (error) {
        next(error);
    }
};

// Delete place (Admin)
const deletePlace = async (req, res, next) => {
    try {
        const place = await TouristPlace.findByIdAndDelete(req.params.id);

        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Tourist place not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Tourist place deleted successfully."
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPlaces,
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace
};