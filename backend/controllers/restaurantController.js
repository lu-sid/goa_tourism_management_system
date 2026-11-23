
const Restaurant = require("../models/Restaurant");

// Get all active restaurants
const getAllRestaurants = async (req, res, next) => {
    try {
        const { search, cuisine, city, minPrice, maxPrice, minRating } = req.query;

        const filter = { status: "Active" };

        if (cuisine) {
            filter.cuisine = {
                $regex: cuisine,
                $options: "i"
            };
        }

        if (city) {
            filter["location.city"] = {
                $regex: city,
                $options: "i"
            };
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { cuisine: { $regex: search, $options: "i" } }
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.averageCost = {};

            if (minPrice !== undefined && minPrice !== "") {
                filter.averageCost.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined && maxPrice !== "") {
                filter.averageCost.$lte = Number(maxPrice);
            }
        }

        if (minRating !== undefined && minRating !== "") {
            filter.rating = { $gte: Number(minRating) };
        }

        const restaurants = await Restaurant.find(filter).sort({ rating: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: restaurants.length,
            restaurants
        });

    } catch (error) {
        next(error);
    }
};

// Get restaurant by ID
const getRestaurantById = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found."
            });
        }

        res.status(200).json({
            success: true,
            restaurant
        });

    } catch (error) {
        next(error);
    }
};

// Create restaurant (Admin)
const createRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.create(req.body);

        res.status(201).json({
            success: true,
            message: "Restaurant added successfully.",
            restaurant
        });

    } catch (error) {
        next(error);
    }
};

// Update restaurant (Admin)
const updateRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Restaurant updated successfully.",
            restaurant
        });

    } catch (error) {
        next(error);
    }
};

// Delete restaurant (Admin)
const deleteRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully."
        });

    } catch (error) {
        next(error);
    }
};


// Get every restaurant, including inactive listings (Admin only)
const getAllRestaurantsAdmin = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: restaurants.length,
            restaurants
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getAllRestaurantsAdmin,
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};



