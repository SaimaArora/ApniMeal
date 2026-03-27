const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const asyncHandler = require("../utils/asyncHandler"); //for thrown errors

//register new user - post /api/users/register
const registerUser = asyncHandler(async(req, res) => {
        const {name, email, password, role} = req.body; //extract user data, parses it using app.use(express.json()) middleware
        //check if user exists
        const userExists = await User.findOne({email}); //find user with this email
        if(userExists) {
            res.status(400);
            throw new Error("User already exists");
        }
        //hashPassword - make it unique and secure
        const salt = await bcrypt.genSalt(10); //generate salt with 10 rounds, more rounds = more secure but slower
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const currUser = await User.create({
            name, email, password: hashedPassword, role //save user in dtbs
        });
        if(currUser){
            res.status(201).json({
                success: true,
                user: {
                    _id: currUser._id,
                    name: currUser.name,
                    email: currUser.email,
                    role: currUser.role,
                    token: generateToken(currUser._id), //login immediately
                }
            });
        } else{
        res.status(400);
        throw new Error ("Invalid user data");
    }
});

//Login user - post /api/users/login
const loginUser = asyncHandler(async (req, res) =>{
        const { email, password } = req.body;
        const user = await User.findOne({ email }); //check if user exists
        if(!user) {
            res.status(400);
            throw new Error("Invalid email or password");
        }
        const isMatch = await bcrypt.compare(password, user.password); //safely compare input plain text to hashsed db password
        if(!isMatch) {
            res.status(400);
            throw new Error("Invalid Password or email");
        }
        //generate token
        const token = generateToken(user._id); //create jwt using user id
        res.json({
            message:"Login successful",
            token, //store token in frontend
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
});

const getUserProfile = asyncHandler(async (req, res)=>{
    if(req.user) {
    res.json({
        message:"User profile fetched",
        user: req.user
    });
    } else {
        res.status(404);
        throw new Error("User not Found");
    }
});

module.exports = {
    registerUser,
    loginUser, 
    getUserProfile
};