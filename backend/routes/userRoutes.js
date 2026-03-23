const express = require("express")
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");

const { protect }  = require("../middleware/authMiddleware");

const router = express.Router(); //create new router object, define routes on it, then export to use in server.js

router.post("/register", registerUser); //when POST request is made to /api/users/register, call registerUser controller function
router.post("/login", loginUser); //post /api/users/login

router.get("/profile", protect, getUserProfile); //request->protect->getuserprofile->response

module.exports = router; //export the router object to use in server.js