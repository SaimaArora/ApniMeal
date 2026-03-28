const Cart = require("../models/Cart");
const Food = require("../models/Food");
const asyncHandler = require("../utils/asyncHandler");
const Order = require("../models/Order");
//get cart
const getCart = asyncHandler(async(req, res)=>{
    let cart = await Cart.findOne({student: req.user._id}).populate("itmes.food");
    if(!cart) {
        cart = await Cart.create({student: req.user._id, items:[]});
    }
    res.json(cart);
});

//add to cart
const addToCart = asyncHandler(async(req, res)=>{
    const { foodId, quantity} = req.body;
    let cart = await Cart.findOne({student:req.user._id});
    if(!cart) {
        cart = await Cart.create({student: req.user._id, items:[]});
    }
    const itemIndex = cart.items.findIndex((item)=> item.food.toString() === foodId);
    if(itemIndex > -1) {
        cart.items[itemIndex].quantity+=quantity;
    } else {
        cart.items.push({food: foodId, quantity});
    }
    await cart.save();
    res.json({message:"Items added to cart", cart});
});

//remove from cart
const removeFromCart = asyncHandler(async(req, res)=>{
    const {foodId} = req.body;
    const cart = await Cart.findOne({student: req.user._id});
    cart.items = cart.items.filter(
        (item)=> item.food.toString() !== foodId
    );
    await cart.save();
    res.json({message:"item removed", cart});
});

//checkout -> create orders
const checkout = asyncHandler(async(req, res)=>{
    const cart = await Cart.findOne({student: req.user._id}).populate("items.food");
    if(!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error("Cart is empty");
    }
    const orders=[];
    for(const item of cart.items) {
        const food = item.food;
        const order = await Order.create({
            student: req.user._id,
            cook: food.cook,
            foodItem: food._id,
            quantity:item.quantity,
            totalPrice: food.price * item.quantity
        });
        orders.push(order);
    }
    //clear cart
    cart.items = [];
    await cart.save();
    res.json({
        success: true,
        message:"Order placed from cart",
        orders
    });
});

module.exports={
    getCart,
    addToCart,
    removeFromCart,
    checkout
};