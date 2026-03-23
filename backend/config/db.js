const mongoose = require("mongoose"); //loads the mongodb orm
const connectDB = async() =>{ //async, takes time to complete
    try{
        const conn = await mongoose.connect(process.env.mongo_url); //read from .env
        console.log(`MongoDB Conneccted: ${conn.connection.host}`);
    } catch(error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); //server stops immediately
    }
};
module.exports = connectDB;