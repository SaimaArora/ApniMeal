const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
    createOrder,
    getMyOrders,
    getCookOrders,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validationMiddleware");


//student views own orders
router.get("/my-orders", protect, authorizeRoles("student"), getMyOrders);

//cook vieews incoming orders
router.get("/cook-orders", protect, authorizeRoles("cook"), getCookOrders);

//student places order
router.post("/", protect, authorizeRoles("student"), [
    body("foodId").notEmpty().withMessage("Food selection is required"),
    body("quantity").isInt({min:1}).withMessage("Quantity must be atleat 1")
], validate, createOrder);


router.put("/:id/cancel", protect, authorizeRoles("student"), cancelOrder);

//update status validation
//cook updates status
router.put("/:id/status", protect, authorizeRoles("cook"),[
    body("status").isIn(["pending", "accepted", "preparing", "completed"]).withMessage("Invalid status")
], validate, updateOrderStatus);


module.exports = router;
// POST   /api/orders
// GET    /api/orders/my-orders
// GET    /api/orders/cook-orders
// PUT    /api/orders/:id/status
// PUT    /api/orders/:id/cancel  