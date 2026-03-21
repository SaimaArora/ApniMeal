const Food = require("../models/Food");

//create food - cook can do it
exports.createFood = async (req, res)=>{
    try{
        const { title, description, price, isVeg} = req.body;
        const food = await Food.create({
            title,
            description,
            price,
            isVeg,
            cook: req.user._id //to connect loggedin user to food, ensures ownership
        });
        res.status(201).json({
            message: "Food item created",
            food
        });
    } catch (error){
        res.status(500).json({
            message: error.message
        });
    }
};

//get all food
exports.getFoods = async(req, res) =>{
    try{
        const foods = await Food.find().populate("cook", "name email"); //to get "cook":{ name:"abc", email:"abc@gmail" }
        res.json(foods);
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//filter veg/nonveg
exports.getFoodsByFilter = async (req, res) =>{
    try{
        const { isVeg, minPrice, maxPrice } = req.query; //query filter: filter?isVeg=true
        const filter = {};
        if(isVeg !== undefined){
            filter.isVeg = isVeg === "true";
        }
        if(minPrice || maxPrice) {
            filter.price={};
            if(minPrice) filter.price.$gte = Number(minPrice);
            if(maxPrice) filter.price.$lte = Number(maxPrice);
        }
        const foods = await Food.find(filter);
        res.json(foods);
    } catch(error) {
        res.status(500).json({
            message:error.message
        });
    }
};

//search food
exports.searchFood = async (req, res) =>{
    try{
        const {keyword} = req.query; //get /api/foods/search?keyword=parantha
        if(!keyword) {
            return res.status(400).json({
                message:"Search keyword is required"
            });
        }
        const foods = await Food.find({
            $text: { $search: keyword } //search in title+description
        }).populate("cook", "name");
        res.json(foods);
    } catch(error) {
        res.status(500).json({
            message:error.message
        });
    }
};