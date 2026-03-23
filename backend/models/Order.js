const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
    {
        student:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        cook:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        foodItem:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Food",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        totalPrice:{
            type:Number,
            required: true
        },
        status:{
            type: String,
            enum:["pending", "accepted","preparing", "delivered"], //enforces valid states
            default: "pending"
        }
    }, 
    {
        timestamps: true
    }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;