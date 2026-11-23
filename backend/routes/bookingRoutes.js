const express = require("express");
const router = express.Router();

const {
    createBooking,
    getMyBookings,
    getAllBookings,
    getBookingById,
    cancelBooking,
    updateBookingStatus
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/", protect, authorize("admin"), getAllBookings);
router.get("/:id", protect, getBookingById);
router.patch("/:id/cancel", protect, cancelBooking);
router.patch("/:id/status", protect, authorize("admin"), updateBookingStatus);

module.exports = router;
