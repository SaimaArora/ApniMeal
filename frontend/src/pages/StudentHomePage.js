import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentHomePage.css";
import cartImg from "../assets/cart.png";
import foodImg from "../assets/meal.png";      
import ordersImg from "../assets/delivery.png"; 

const StudentHomePage = () =>{
    const navigate = useNavigate();
    return(
        <div className="home-container">
            <div className="card" onClick={()=> navigate("/cart")}>
                <img src={cartImg} alt="cart" className="card-img" />
                <h2>My Cart</h2>
                <p>View and manage your selected items</p>
            </div>

            <div className="card main-card" onClick={()=> navigate("/student-dashboard")}>
                <img src={foodImg} alt="food" className="card-img" />
                <h2>Browse Food</h2>
                <p>Discover fresh home-cooked meals near you</p>
            </div>

            <div className="card" onClick={()=> navigate("/student-dashboard/orders")}>
                <img src={ordersImg} alt="orders" className="card-img" />
                <h2>Orders</h2>
                <p>Track your current and past orders</p>
            </div>
        </div>
    );
};

export default StudentHomePage;