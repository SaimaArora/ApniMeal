import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

const Navbar=()=>{
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch =(e)=>{
        e.preventDefault();
        if(searchQuery.trim()) {
            navigate(`/student-dashboard?q=${searchQuery}`);
            setSearchQuery("");
        }
    };

    return(
        <div className="navbar">
            <img src={logo} alt="ApniMeal" className="logo-img" onClick={()=> navigate("/student-home")}/>
            <div className="nav-links">
                <NavLink to="/student-home">Home</NavLink>
                <NavLink to="/student-dashboard">Browse</NavLink>
            </div>
            {user && user?.user?.role === "student" && (
                <form onSubmit={handleSearch} className="search-form">
                    <input type="text" placeholder="Search food..." value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)}/>
                </form>
            )}
            {/* right side */}
            <div className="nav-actions">
                {user && user?.user?.role === "student" && (
                    <>
                        <NavLink to="/cart">Cart</NavLink>
                        <NavLink to="/student-dashboard/orders">Orders</NavLink>
                    </>
                )}
                {user && (
                    <button onClick={logout}>Logout</button>
                )}
            </div>
        </div>
    );
};
export default Navbar;