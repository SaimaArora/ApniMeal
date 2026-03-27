const Order = require("../models/Order");
const Food = require("../models/Food");
const asyncHandler = require("../utils/asyncHandler"); 

//place order - student only - post /api/orders
const createOrder  = asyncHandler(async(req, res)=> {
        const { foodId, quantity } = req.body;
        //find food
        const food = await Food.findById(foodId);

        if(!food) {
            res.status(404);
            throw new Error("Food item not found");
        }

        //calculate total price
        const totalPrice = food.price*quantity; // compute in backend
        const order = await Order.create({
            student:req.user._id,
            cook: food.cook,
            foodItem: food._id,
            quantity,
            totalPrice
        });

        res.status(201).json({
            succes: true,
            message: "Order placed successfully",
            order
        });
});

//get student orders - get /api/orders/my-orders
const getMyOrders = asyncHandler(async(req, res)=> {
        const orders = await Order.find({
            student: req.user._id
        })
        .populate("foodItem")
        .populate("cook", "name");
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
});

//get cook orders - get /api/orders/cookorders
const getCookOrders = asyncHandler(async(req, res)=> {
        const orders = await Order.find({ cook: req.user._id})
        .populate("foodItem")
        .populate("student", "name"); //to fetch related data

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
});

//update order status - put api/orders/:id/status
const updateOrderStatus = asyncHandler(async(req, res)=> {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if(!order) {
            res.status(404);
            throw new Error("Order not Found");
        }
        //ensure assigned cook can update
        if (order.cook.toString() !== req.user._id.toString()) { //so other cooks dont modify data, assigned cook can update
            res.status(403);
            throw new Error("Not authorized to update this order");
        }

        order.status = status || order.status;
        const updatedOrder = await order.save();
        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order: updatedOrder
        });
});

module.exports = {
    createOrder,
    getMyOrders,
    getCookOrders,
    updateOrderStatus
};