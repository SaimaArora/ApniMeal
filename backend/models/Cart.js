const mongoose = require("mongoose");
const cartItemSchema = new mongoose.Schema({ //items:[{food:foodid, quantity:2}]
    food:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },
    quantity:{
        type:Number,
        default:1
    }
});
const cartSchema = new mongoose.Schema(
    {
        student:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
        items: [cartItemSchema]
    },
    {timestamps: true}
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;