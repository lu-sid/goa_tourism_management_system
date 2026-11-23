
const User = require("../models/User");
const Booking = require("../models/Booking");

// Get logged-in user's profile
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        next(error);
    }
};

// Update profile
const updateProfile = async (req, res, next) => {
    try {
        const { name, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user
        });

    } catch (error) {
        next(error);
    }
};

// Get all users (Admin)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        next(error);
    }
};

// Delete user (Admin)
const deleteUser = async (req, res, next) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own admin account."
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Administrator accounts cannot be deleted through tourist management."
            });
        }

        const hasBookings = await Booking.exists({
            user: user._id
        });

        if (hasBookings) {
            return res.status(409).json({
                success: false,
                message: "This user has booking history. The account cannot be deleted."
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    deleteUser
};
