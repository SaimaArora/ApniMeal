const mongoose = require("mongoose");
const foodSchema = new mongoose.Schema(
    {
        title: {
        type: String,
        required: true,
        trim: true
        },

        description:{
            type:String,
            required: true
        },
        price:{
            type:Number,
            required:true
        },
        isVeg: {
            type: Boolean,
            default:true
        },
        cook:{ //food belongs to user(cook)
            type:mongoose.Schema.Types.ObjectId, //creates a relationship
            ref:"User",
            required:true
        },
        available:{
            type: Boolean,
            default:true
        }
    }, 
    {
        timestamps: true
    }
);
//before model creation add index
foodSchema.index({title: "text", description:"text"});
const Food = mongoose.model("Food", foodSchema);
module.exports = Food;