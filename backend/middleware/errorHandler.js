const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error stack trace in development

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
