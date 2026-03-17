const express = require("express");
const {
    createFood, getFoods, getFoodsByFilter
} = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const foodController = require("../controllers/foodController");

console.log("Full Controller Object:", foodController);
//create food
router.post("/",protect, createFood);
//get all food
router.get("/", getFoods);
//filter food
router.get("/filter", getFoodsByFilter);

module.exports = router;
