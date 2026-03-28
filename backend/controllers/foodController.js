const Food = require("../models/Food");
const asyncHandler = require("../utils/asyncHandler");

//create food - cook can do it - post /api/foods
exports.createFood = asyncHandler(async (req, res)=>{
        const { title, description, price, isVeg} = req.body;
        const food = await Food.create({
            title,
            description,
            price,
            isVeg,
            cook: req.user._id //to connect loggedin user to food, ensures ownership
        });
        res.status(201).json({
            success: true,
            message: "Food item created",
            food
        });

});

//get all food - get /api/foods
exports.getFoods = asyncHandler(async(req, res) =>{

        const foods = await Food.find({available: true }).populate("cook", "name email"); //to get "cook":{ name:"abc", email:"abc@gmail" }
        res.status(200).json({
            success: true,
            count: foods.length,
            foods
        });
});

exports.getMyFoods = asyncHandler(async(req, res) => {
    const foods = await Food.find({cook : req.user._id});
    res.json({
        success: true,
        foods
    });
});


//filter veg/nonveg - get /api/foods/filter
exports.getFoodsByFilter = asyncHandler(async (req, res) =>{
        const { isVeg, minPrice, maxPrice } = req.query; //query filter: filter?isVeg=true
        const filter = {
            available: true
        };
        if(isVeg !== undefined){
            filter.isVeg = isVeg === "true";
        }
        if(minPrice || maxPrice) {
            filter.price={};
            if(minPrice) filter.price.$gte = Number(minPrice);
            if(maxPrice) filter.price.$lte = Number(maxPrice);
            //GET /api/foods/filter?isVeg=true&minPrice=20&maxPrice=100
        }
        const foods = await Food.find(filter);
        res.status(200).json({
            success: true,
            count:foods.length,
            foods
        });
});

//search food - get /api/foods/search
exports.searchFood = asyncHandler(async (req, res) =>{
        const {keyword} = req.query; //get /api/foods/search?keyword=parantha
        if(!keyword) {
            res.status(400);
            throw new Error("Search keyword is required");
        }
        const foods = await Food.find({
            $text: { $search: keyword }, //search in title+description
            available: true
        }).populate("cook", "name");
        res.status(200).json({
            success: true,
            count: foods.length,
            foods
        });
});

exports.updateFood = asyncHandler(async(req, res)=>{
    const food = await Food.findById(req.params.id);
    if (!food) {
        res.status(404);
        throw new Error("Food not found");
    }
    //ownership check
    if(food.cook.toString() != req.user._id.toString()) {//other cooks cannot edit
        res.status(403);
        throw new Error("Not authorized to update this food");
    }
    //update seleected fields (partial)
    const { title, description, price, isVeg, available } = req.body;
    if(title != undefined) food.title = title;
    if(description !== undefined) food.description = description;
    if(price !== undefined) food.price = price;
    if(available !== undefined) food.available = available;
    if(isVeg !== undefined) food.isVeg = isVeg;

    const updatedFood = await food.save();
    res.json({
        success: true,
        food:updatedFood
    });
});

//delelte food
exports.deleteFood = asyncHandler(async(req, res)=>{
    const food = await Food.findById(req.params.id);
    if(!food) {
        res.status(404);
        throw new Error("Food not found");
    }
    if(food.cook.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this food");
    }
    await food.deleteOne();
    res.json({
        success: true,
        message:"Food deleted successfully"
    });
});