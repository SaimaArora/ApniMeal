const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async(req, res, next)=>{
    let token;
    //check if token is in headers
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer") //frontend sends Bearer token
    ) {
        try{
            //extract the token
            token = req.headers.authorization.split(" ")[1];
            //verify token
            const decoded = jwt.verify(token, process.env.jwt_secret); //check if token valid, extracts payload

            //get user from db - exclude password
            req.user = await User.findById(decoded.id);
            next(); //move to next controller/middleware, otherwise req gets stuck

        } catch(error){
            return res.status(401).json({
                message:"Not authorized, token failed"
            });
        }
    }
    if(!token) {
        return res.status(401).json({
            message:"Not authorized, no token"
        });
    }
};
module.exports = { protect };