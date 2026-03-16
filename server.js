const express = require("express"); //loads express
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db"); //import connection function

const app = express(); //initialize the server, middleware routes connect to app

connectDB(); // connect dtbs, runs when server starts. Start server -> connect mongo -> api ready

//Middleware
app.use(cors()); //allow frontend to call backend, allows cross-origin requests
app.use(express.json()); //allow server to read json from req

//test routes
app.get("/", (req, res)=>{
    res.send("Api is running..");
});
const port = process.env.port || 5000;
app.listen(port, ()=>{
    console.log(`Server is running on port${port}`); //start the backend server, listen on port 5000 or env port
});