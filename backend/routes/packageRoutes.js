const express = require("express");
const router = express.Router();

const {
    getAllPackages,
    getAllPackagesAdmin,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
} = require("../controllers/packageController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/admin/all", protect, authorize("admin"), getAllPackagesAdmin);

router.route("/")
    .get(getAllPackages)
    .post(protect, authorize("admin"), createPackage);

router.route("/:id")
    .get(getPackageById)
    .put(protect, authorize("admin"), updatePackage)
    .delete(protect, authorize("admin"), deletePackage);

module.exports = router;
