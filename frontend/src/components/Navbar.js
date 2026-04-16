import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

const Navbar=()=>{
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const role  = user?.user?.role;

    const handleSearch =(e)=>{
        e.preventDefault();
        if(searchQuery.trim()) {
            navigate(`/student-dashboard?q=${searchQuery}`);
            setSearchQuery("");
        }
    };

    return(
        <div className="navbar">
            <img src={logo} alt="ApniMeal" className="logo-img" onClick={()=> navigate(role==="cook" ? "/cook-dashboard" : "/student-home")}/>
            {role === "student" && (
                <>
                    <div className="nav-links">
                        <NavLink to="/student-home">Home</NavLink>
                        <NavLink to="/student-dashboard">Browse</NavLink>
                    </div>
                    <form onSubmit={handleSearch} className="search-form">
                        <input type="text" placeholder="Search food..." value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)}/>
                    </form>
                    <div className="nav-actions">
                        <NavLink to="/cart">Cart</NavLink>
                        <NavLink to="/student-dashboard/orders">Orders</NavLink>
                        <button onClick={logout}>Logout</button>
                  </div>
                  </>  )}
            {role === "cook" && (
                <div className="nav-actions" style={{ marginLeft:"auto", gap:"10px" }}>
                    <button className="primary-btn" onClick={()=> window.dispatchEvent(new Event("openAddFoodModal"))}>+ Add Food</button>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
        </div>    
    );
};
export default Navbar;