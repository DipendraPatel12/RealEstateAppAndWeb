const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = null;

    // Catch Sequelize Validation and Unique Constraint Errors
    if (
        err.name === 'SequelizeValidationError' ||
        err.name === 'SequelizeUniqueConstraintError'
    ) {
        statusCode = 400;
        message = 'Validation Error';
        errors = err.errors.map((e) => ({
            field: e.path,
            message: e.message
        }));
    }

    // Catch general database errors
    if (err.name === 'SequelizeDatabaseError') {
        statusCode = 500;
        message = 'Database operation failed';
    }

    // Log the error on the server side
    console.error(`[Error] ${statusCode} - ${err.message}`);

    // Send uniform JSON response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;