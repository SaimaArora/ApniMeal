const { validationResult } = require("express-validator");
//middleware to check validation result
const validate = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400);
        throw new Error(errors.array()[0].msg); //returns {{mesg:"Invalid email"}}
        //thrown error is handled by global error middleware
    }
    next();
};
module.exports = { validate }; 