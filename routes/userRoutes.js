const express = require("express")
const { registerUser } = require("../controllers/userController");

const router = express.Router(); //create new router object, define routes on it, then export to use in server.js
router.post("/register", registerUser); //when POST request is made to /api/users/register, call registerUser controller function
module.exports = router; //export the router object to use in server.js