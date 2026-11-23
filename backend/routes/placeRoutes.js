const express = require("express");
const router = express.Router();

const {
    getAllPlaces,
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace
} = require("../controllers/placeController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Public destination discovery
router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);

// Admin-only destination management
router.post("/", protect, authorize("admin"), createPlace);
router.put("/:id", protect, authorize("admin"), updatePlace);
router.delete("/:id", protect, authorize("admin"), deletePlace);

module.exports = router;
