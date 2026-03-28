const express = require("express");
const {
    getCart, addToCart, removeFromCart, checkout
} = require("../controllers/cartController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorizeRoles("student"), getCart);
router.post("/", protect, authorizeRoles("student"), addToCart);
router.delete("/", protect, authorizeRoles("student"), removeFromCart);
router.post("/checkout", protect, authorizeRoles("student"), checkout);

module.exports = router;