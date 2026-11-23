
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT and authenticate user
const protect = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            const error = new Error("Not authorized. No token provided.");
            error.statusCode = 401;
            return next(error);
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user associated with token
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            const error = new Error("User associated with this token no longer exists.");
            error.statusCode = 401;
            return next(error);
        }

        // Attach authenticated user to request
        req.user = user;

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            error.message = "Session expired. Please log in again.";
            error.statusCode = 401;
        } else if (error.name === "JsonWebTokenError") {
            error.message = "Invalid authentication token.";
            error.statusCode = 401;
        }

        next(error);
    }
};

// Restrict access based on user role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            const error = new Error("Authentication required.");
            error.statusCode = 401;
            return next(error);
        }

        if (!roles.includes(req.user.role)) {
            const error = new Error("You do not have permission to access this resource.");
            error.statusCode = 403;
            return next(error);
        }

        next();
    };
};

module.exports = {
    protect,
    authorize
};