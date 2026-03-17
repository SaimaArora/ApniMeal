const express = require("express");
const {
    createFood, getFoods, getFoodsByFilter
} = require("../controllers/foodController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

//create food - only cook can
router.post("/",protect, authorizeRoles("cook"), createFood);
//get all food
router.get("/", getFoods);
//filter food
router.get("/filter", getFoodsByFilter);

module.exports = router;
