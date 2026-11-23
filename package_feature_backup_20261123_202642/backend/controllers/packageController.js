
const TourPackage = require("../models/TourPackage");

// Get all active packages
const getAllPackages = async (req, res, next) => {
    try {
        const { search, category, minPrice, maxPrice } = req.query;

        const filter = { status: "Active" };

        if (category) filter.category = category;

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const packages = await TourPackage.find(filter)
            .populate("destinations", "name category location");

        res.status(200).json({
            success: true,
            count: packages.length,
            packages
        });

    } catch (error) {
        next(error);
    }
};

// Get package by ID
const getPackageById = async (req, res, next) => {
    try {
        const tourPackage = await TourPackage.findById(req.params.id)
            .populate("destinations", "name category location images");

        if (!tourPackage) {
            return res.status(404).json({
                success: false,
                message: "Tour package not found."
            });
        }

        res.status(200).json({
            success: true,
            tourPackage
        });

    } catch (error) {
        next(error);
    }
};

// Create package (Admin)
const createPackage = async (req, res, next) => {
    try {
        const tourPackage = await TourPackage.create(req.body);

        res.status(201).json({
            success: true,
            message: "Tour package created successfully.",
            tourPackage
        });

    } catch (error) {
        next(error);
    }
};

// Update package (Admin)
const updatePackage = async (req, res, next) => {
    try {
        const tourPackage = await TourPackage.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!tourPackage) {
            return res.status(404).json({
                success: false,
                message: "Tour package not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Tour package updated successfully.",
            tourPackage
        });

    } catch (error) {
        next(error);
    }
};

// Delete package (Admin)
const deletePackage = async (req, res, next) => {
    try {
        const tourPackage = await TourPackage.findByIdAndDelete(req.params.id);

        if (!tourPackage) {
            return res.status(404).json({
                success: false,
                message: "Tour package not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Tour package deleted successfully."
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
};