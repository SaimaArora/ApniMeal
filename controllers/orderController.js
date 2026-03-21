const Order = require("../models/Order");
const Food = require("../models/Food");

//place order - student only
async function createOrder (req, res) {
    try{
        const { foodId, quantity } = req.body;
        //find food
        const food = await Food.findById(foodId);

        if(!food) {
            return res.status(404).json({
                message:"Food item not found"
            });
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
            message: "Order placed successfully",
            order
        });

    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//get student orders
async function getMyOrders(req, res) {
    try{
        const orders = await Order.find({
            student: req.user._id
        })
        .populate("foodItem")
        .populate("cook", "name");
        res.json(orders);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//get cook orders
async function getCookOrders (req, res) {
    try{
        const orders = await Order.find({ cook: req.user._id})
        .populate("foodItem")
        .populate("student", "name"); //to fetch related data
        res.json(orders);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//update order status
async function updateOrderStatus (req, res) {
    try{
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if(!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        //ensure assigned cook can update
        if (order.cook.toString() !== req.user._id.toString()) { //so other cooks dont modify data, assigned cook can update
            return res.status(403).json({
                message: "Not authorized to update this order"
            });
        }

        order.status = status;

        await order.save();
        res.json({
            message: "Order status updated", 
            order
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getCookOrders,
    updateOrderStatus
};