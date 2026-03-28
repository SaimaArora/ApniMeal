const express = require("express"); //loads express
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require("dotenv").config();
const connectDB = require("./config/db"); //import connection function
const userRoutes = require("./routes/userRoutes"); //import user routes
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express(); //initialize the server, middleware routes connect to app

connectDB(); // connect dtbs, runs when server starts. Start server -> connect mongo -> api ready

//Middleware
app.use(cors()); //allow frontend to call backend, allows cross-origin requests
app.use(express.json()); //allow server to read json from req

//Routes - means router.post("/register") becomes post /spi/users/register
app.use("/api/users", userRoutes); //when request starts with /api/users, forward to userRoutes, which has /register route defined
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

//test routes
app.get("/", (req, res)=>{
    res.send("Api is running..");
});
//middlewares for errors 
app.use(notFound);
app.use(errorHandler);

const port = process.env.port || 3000;
app.listen(port, ()=>{
    console.log(`Server is running on port${port}`); //start the backend server, listen on port 5000 or env port
});