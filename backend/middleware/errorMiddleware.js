
// Not Found Middleware
const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

// Central Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || res.statusCode || 500;

    if (statusCode === 200) {
        statusCode = 500;
    }

    let message = err.message || "Internal Server Error";

    // MongoDB validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    }

    // MongoDB duplicate key errors
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || "Field";
        message = `${field} already exists.`;
    }

    // MongoDB invalid ObjectId errors
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID.";
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack
        })
    });
};

module.exports = {
    notFound,
    errorHandler
};