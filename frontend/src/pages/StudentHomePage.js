import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentHomePage.css";

const StudentHomePage = () =>{
    const navigate = useNavigate();
    return(
        <div className="home-container">
            <div className="card" onClick={()=> navigate("/cart")}>
                <h2>My Cart</h2>
                <p>View item you've added</p>
            </div>
            <div className="card main-card" onClick={()=> navigate("/student-dashboard")}>
                <h2>Browse Food</h2>
                <p>Explore home-cooked meals</p>
            </div>
            <div className="card" onClick={()=> navigate("/student-dashboard/orders")}>
                <h2>Orders</h2>
                <p>Track your orders</p>
            </div>
        </div>
    );
};

export default StudentHomePage;