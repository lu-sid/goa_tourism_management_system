
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { randomUUID } = require("crypto");

// Create payment record
const createPayment = async (req, res, next) => {
    try {
        const {
            booking,
            amount,
            paymentMethod,
            transactionId
        } = req.body;

        if (!booking || amount === undefined || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Booking, amount and payment method are required."
            });
        }

        const bookingRecord = await Booking.findById(booking);

        if (!bookingRecord) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        if (bookingRecord.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot make payment for this booking."
            });
        }

        if (bookingRecord.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cannot pay for a cancelled booking."
            });
        }

        if (Number(amount) !== bookingRecord.totalAmount) {
            return res.status(400).json({
                success: false,
                message: "Payment amount does not match the booking amount."
            });
        }

        const existingSuccessfulPayment = await Payment.findOne({
            booking,
            status: "Successful"
        });

        if (existingSuccessfulPayment) {
            return res.status(409).json({
                success: false,
                message: "This booking has already been paid for."
            });
        }

        const payment = await Payment.create({
            paymentId: `PAY-${randomUUID()}`,
            booking,
            user: req.user._id,
            amount,
            paymentMethod,
            transactionId,
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            message: "Payment record created successfully.",
            payment
        });

    } catch (error) {
        next(error);
    }
};

// Get logged-in user's payments
const getMyPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({
            user: req.user._id
        })
            .populate("booking")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        next(error);
    }
};

// Get all payments (Admin)
const getAllPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find()
            .populate("user", "name email")
            .populate("booking")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        next(error);
    }
};

// Update payment status (Admin)
const updatePaymentStatus = async (req, res, next) => {
    try {
        const allowedStatuses = [
            "Pending",
            "Successful",
            "Failed",
            "Refunded"
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status."
            });
        }

        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });
        }

        payment.status = status;

        if (status === "Successful") {
            payment.paymentDate = new Date();
        }

        await payment.save();

        // Confirm booking after successful payment
        if (status === "Successful") {
            await Booking.findByIdAndUpdate(
                payment.booking,
                { status: "Confirmed" }
            );
        }

        res.status(200).json({
            success: true,
            message: "Payment status updated successfully.",
            payment
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPayment,
    getMyPayments,
    getAllPayments,
    updatePaymentStatus
};