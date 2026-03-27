const express = require("express");
const { body } = require("express-validator")
const {
    createFood, getFoods, getFoodsByFilter, searchFood, updateFood, deleteFood
} = require("../controllers/foodController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validationMiddleware");

const router = express.Router();

//create food - only cook can
router.post("/",protect, authorizeRoles("cook"),
[
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number")
], validate, createFood);

router.put("/:id", protect, authorizeRoles("cook"), updateFood);

router.delete("/:id", protect, authorizeRoles("cook"), deleteFood);
//public routes
//get all food
router.get("/", getFoods);
//filter food
router.get("/filter", getFoodsByFilter);
//search route
router.get("/search", searchFood);

module.exports = router;
// POST   /api/foods        → create food
// PUT    /api/foods/:id    → update food
// DELETE /api/foods/:id    → delete food
// GET    /api/foods        → get all