const TourPackage = require("../models/TourPackage");
const Booking = require("../models/Booking");
require("../models/TouristPlace");

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
                const value = Number(minPrice);
                if (!Number.isFinite(value) || value < 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Minimum price must be a valid non-negative number."
                    });
                }
                filter.price.$gte = value;
            }

            if (maxPrice !== undefined) {
                const value = Number(maxPrice);
                if (!Number.isFinite(value) || value < 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Maximum price must be a valid non-negative number."
                    });
                }
                filter.price.$lte = value;
            }
        }

        const packages = await TourPackage.find(filter)
            .populate("destinations", "name category location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: packages.length,
            packages
        });
    } catch (error) {
        next(error);
    }
};

const getAllPackagesAdmin = async (req, res, next) => {
    try {
        const packages = await TourPackage.find()
            .populate("destinations", "name category location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: packages.length,
            packages
        });
    } catch (error) {
        next(error);
    }
};

const getPackageById = async (req, res, next) => {
    try {
        const tourPackage = await TourPackage.findOne({
            _id: req.params.id,
            status: "Active"
        }).populate("destinations", "name category location images");

        if (!tourPackage) {
            return res.status(404).json({
                success: false,
                message: "Active tour package not found."
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

const deletePackage = async (req, res, next) => {
    try {
        const tourPackage = await TourPackage.findById(req.params.id);

        if (!tourPackage) {
            return res.status(404).json({
                success: false,
                message: "Tour package not found."
            });
        }

        const hasBookings = await Booking.exists({
            tourPackage: tourPackage._id
        });

        if (hasBookings) {
            return res.status(409).json({
                success: false,
                message: "This package has booking history. Set it to Inactive instead of deleting it."
            });
        }

        await tourPackage.deleteOne();

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
    getAllPackagesAdmin,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
};

