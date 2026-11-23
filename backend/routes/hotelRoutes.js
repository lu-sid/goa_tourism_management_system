const express = require("express");
const router = express.Router();

const {
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel
} = require("../controllers/hotelController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
    .get(getAllHotels)
    .post(protect, authorize("admin"), createHotel);

router.route("/:id")
    .get(getHotelById)
    .put(protect, authorize("admin"), updateHotel)
    .delete(protect, authorize("admin"), deleteHotel);

module.exports = router;
