const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getCookOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");


//student places order
router.post("/", protect, authorizeRoles("student"), createOrder);

//student views own orders
router.get("/my-orders", protect, authorizeRoles("student"), getMyOrders);

//cook vieews incoming orders
router.get("/cook-orders", protect, authorizeRoles("cook"), getCookOrders);

//cook updates status
router.put("/:id/status", protect, authorizeRoles("cook"), updateOrderStatus);

module.exports = router;