const express = require("express");
const router = express.Router();

const {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} = require("../controllers/restaurantController");

const { protect, authorize } = require("../middleware/authMiddleware");
const { getAllRestaurantsAdmin } = require("../controllers/restaurantController");

router.get("/admin/all", protect, authorize("admin"), getAllRestaurantsAdmin);
router.route("/")
    .get(getAllRestaurants)
    .post(protect, authorize("admin"), createRestaurant);

router.route("/:id")
    .get(getRestaurantById)
    .put(protect, authorize("admin"), updateRestaurant)
    .delete(protect, authorize("admin"), deleteRestaurant);

module.exports = router;

