//not found middleware
const notFound = (req, res, next)=>{
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

//global error handler
const errorhandler = (err, req, res, next) =>{
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

module.exports = {
    notFound,
    errorHandler
}