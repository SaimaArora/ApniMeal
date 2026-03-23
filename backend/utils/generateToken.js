const jwt =require("jsonwebtoken")
const generateToken = (id) =>{
    return jwt.sign(
        { id }, //payload - data inside token
        process.env.jwt_secret, //encryption key
        { expiresIn: "7d" }//token lifetime
    );
};
module.exports = generateToken;