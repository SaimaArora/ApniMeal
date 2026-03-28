//not found middleware triggers when route doesnt exist
const notFound = (req, res, next)=>{
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

//global error handler handles all errors globally
const errorHandler = (err, req, res, next) =>{
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode; //if no status, default to 500

    res.status(statusCode).json({ //standard response format
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

module.exports = {
    notFound,
    errorHandler
}