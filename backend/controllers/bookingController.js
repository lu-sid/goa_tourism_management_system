
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const TourPackage = require("../models/TourPackage");
const { randomUUID } = require("crypto");

// Create booking
const createBooking = async (req, res, next) => {
    try {
        const {
            bookingType,
            hotel,
            tourPackage,
            checkIn,
            checkOut,
            numberOfGuests,
            totalAmount,
            specialRequests
        } = req.body;

        if (!bookingType || !numberOfGuests) {
            return res.status(400).json({
                success: false,
                message: "Booking type and number of guests are required."
            });
        }

        const guests = Number(numberOfGuests);

        if (!Number.isInteger(guests) || guests < 1) {
            return res.status(400).json({
                success: false,
                message: "Number of guests must be at least 1."
            });
        }

        let calculatedTotalAmount = 0;

        if (bookingType === "Hotel") {
            if (!hotel || !checkIn || !checkOut) {
                return res.status(400).json({
                    success: false,
                    message: "Hotel, check-in and check-out dates are required."
                });
            }

            const hotelRecord = await Hotel.findById(hotel);

            if (!hotelRecord || hotelRecord.status !== "Active") {
                return res.status(404).json({
                    success: false,
                    message: "Active hotel not found."
                });
            }

            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);

            if (
                Number.isNaN(checkInDate.getTime()) ||
                Number.isNaN(checkOutDate.getTime()) ||
                checkOutDate <= checkInDate
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide valid check-in and check-out dates."
                });
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (checkInDate < today) {
                return res.status(400).json({
                    success: false,
                    message: "Check-in date cannot be in the past."
                });
            }

            const nights = Math.round(
                (checkOutDate - checkInDate) / 86400000
            );

            calculatedTotalAmount =
                nights * Number(hotelRecord.pricePerNight);

            if (
                !Number.isFinite(calculatedTotalAmount) ||
                calculatedTotalAmount < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Unable to calculate booking amount."
                });
            }

        } else if (bookingType === "TourPackage") {
            if (!tourPackage) {
                return res.status(400).json({
                    success: false,
                    message: "Tour package is required."
                });
            }

            const packageRecord = await TourPackage.findById(tourPackage);

            if (!packageRecord || packageRecord.status !== "Active") {
                return res.status(404).json({
                    success: false,
                    message: "Active tour package not found."
                });
            }

            if (guests > packageRecord.maxPeople) {
                return res.status(400).json({
                    success: false,
                    message: `Maximum group size is ${packageRecord.maxPeople}.`
                });
            }

            const packagePrice = Number(packageRecord.price);

            if (!Number.isFinite(packagePrice) || packagePrice < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Package price is invalid."
                });
            }

            // The server determines the total.
            // Any totalAmount supplied by the browser is ignored.
            calculatedTotalAmount = packagePrice * guests;

        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid booking type."
            });
        }

        const booking = await Booking.create({
            bookingId: `GT-${randomUUID()}`,
            user: req.user._id,
            bookingType,
            hotel: bookingType === "Hotel" ? hotel : undefined,
            tourPackage: bookingType === "TourPackage" ? tourPackage : undefined,
            checkIn: bookingType === "Hotel" ? checkIn : undefined,
            checkOut: bookingType === "Hotel" ? checkOut : undefined,
            numberOfGuests: guests,
            totalAmount: calculatedTotalAmount,
            specialRequests
        });

        res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            booking
        });

    } catch (error) {
        next(error);
    }
};
// Get logged-in user's bookings
const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id
        })
            .populate("hotel")
            .populate("tourPackage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        next(error);
    }
};

// Get all bookings (Admin)
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email phone")
            .populate("hotel", "name location")
            .populate("tourPackage", "name price")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        next(error);
    }
};

// Get booking by ID
const getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("user", "name email")
            .populate("hotel")
            .populate("tourPackage");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        const ownerId = booking.user._id
            ? booking.user._id.toString()
            : booking.user.toString();

        if (
            ownerId !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {
        next(error);
    }
};

// Cancel booking
const cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        const isOwner = booking.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        if (["Cancelled", "Completed"].includes(booking.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel a ${booking.status.toLowerCase()} booking.`
            });
        }

        booking.status = "Cancelled";
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully.",
            booking
        });

    } catch (error) {
        next(error);
    }
};

// Update booking status (Admin)
const updateBookingStatus = async (req, res, next) => {
    try {
        const transitions = {
            Pending: ["Confirmed", "Cancelled"],
            Confirmed: ["Completed", "Cancelled"],
            Completed: [],
            Cancelled: []
        };

        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status."
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        if (booking.status === status) {
            return res.status(200).json({
                success: true,
                message: "Booking already has this status.",
                booking
            });
        }

        const permitted = transitions[booking.status] || [];

        if (!permitted.includes(status)) {
            return res.status(409).json({
                success: false,
                message: "This booking status transition is not permitted."
            });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking status updated successfully.",
            booking
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    getBookingById,
    cancelBooking,
    updateBookingStatus
};



