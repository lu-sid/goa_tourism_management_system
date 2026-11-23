
const Feedback = require("../models/Feedback");

// Submit feedback
const createFeedback = async (req, res, next) => {
    try {
        const {
            name,
            email,
            subject,
            message,
            category
        } = req.body;

        const feedback = await Feedback.create({
            user: req.user ? req.user._id : undefined,
            name,
            email,
            subject,
            message,
            category
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully.",
            feedback
        });

    } catch (error) {
        next(error);
    }
};

// Get all feedback (Admin)
const getAllFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedback.length,
            feedback
        });

    } catch (error) {
        next(error);
    }
};

// Update feedback status and admin response (Admin)
const updateFeedback = async (req, res, next) => {
    try {
        const { status, adminResponse } = req.body;

        const allowedStatuses = [
            "New",
            "In Progress",
            "Resolved"
        ];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid feedback status."
            });
        }

        const updates = {};

        if (status !== undefined) updates.status = status;
        if (adminResponse !== undefined) {
            updates.adminResponse = adminResponse;
        }

        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback updated successfully.",
            feedback
        });

    } catch (error) {
        next(error);
    }
};

// Delete feedback (Admin)
const deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully."
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFeedback,
    getAllFeedback,
    updateFeedback,
    deleteFeedback
};