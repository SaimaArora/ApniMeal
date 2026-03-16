const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async(req, res) => {
    try{
        const {name, email, password, role} = req.body; //extract user data, parses it using app.use(express.json()) middleware
        //check if user exists
        const userExists = await User.findOne({email}); //find user with this email
        if(userExists) {
            return res.status(400).json({
                message: "User already exists" //reject signup
            });
        }
        //hashPassword - make it unique and secure
        const salt = await bcrypt.genSalt(10); //generate salt with 10 rounds, more rounds = more secure but slower
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const currUser = await User.create({
            name, email, password: hashedPassword, role //save user in dtbs
        });
        res.status(201).json({ //201 - resource created
            message: "User registered successfully",
            user :{
                id: currUser._id,
                name:currUser.name,
                email:currUser.email,
                role:currUser.role
            }
        });
    
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser
};