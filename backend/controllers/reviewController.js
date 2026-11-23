
const Review = require("../models/Review");

const allowedTargetTypes = [
    "TouristPlace",
    "Hotel",
    "Restaurant",
    "TourPackage"
];

// Create review
const createReview = async (req, res, next) => {
    try {
        const { targetType, targetId, rating, comment, images } = req.body;

        if (!allowedTargetTypes.includes(targetType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review target type."
            });
        }

        const review = await Review.create({
            user: req.user._id,
            targetType,
            targetId,
            rating,
            comment,
            images,
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            message: "Review submitted for approval.",
            review
        });

    } catch (error) {
        next(error);
    }
};

// Get approved reviews for an item
const getItemReviews = async (req, res, next) => {
    try {
        const { targetType, targetId } = req.params;

        if (!allowedTargetTypes.includes(targetType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review target type."
            });
        }

        const reviews = await Review.find({
            targetType,
            targetId,
            status: "Approved"
        }).populate("user", "name");

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        next(error);
    }
};

// Get logged-in user's reviews
const getMyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        next(error);
    }
};

// Get all reviews (Admin)
const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        next(error);
    }
};

// Update review status (Admin)
const updateReviewStatus = async (req, res, next) => {
    try {
        const allowedStatuses = ["Pending", "Approved", "Rejected"];

        if (!allowedStatuses.includes(req.body.status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review status."
            });
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Review status updated.",
            review
        });

    } catch (error) {
        next(error);
    }
};

// Delete review (Owner or Admin)
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found."
            });
        }

        const isOwner = review.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete this review."
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: "Review deleted successfully."
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getItemReviews,
    getMyReviews,
    getAllReviews,
    updateReviewStatus,
    deleteReview
};