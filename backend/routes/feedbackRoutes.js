const express = require("express");
const router = express.Router();

const {
    createFeedback,
    getAllFeedback,
    updateFeedback,
    deleteFeedback
} = require("../controllers/feedbackController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Public contact, hotel enquiry and restaurant enquiry submissions
router.post("/", createFeedback);

// Admin-only feedback management
router.get("/", protect, authorize("admin"), getAllFeedback);
router.put("/:id", protect, authorize("admin"), updateFeedback);
router.delete("/:id", protect, authorize("admin"), deleteFeedback);

module.exports = router;
