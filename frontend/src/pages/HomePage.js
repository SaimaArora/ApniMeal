import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate }  from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/logo.png";


function HomePage() {
    const {login} = useContext(AuthContext); //intialiaze auth login
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        name:"",
        email:"",
        password:"",
        role:"student",
    });
    const handleChange=(e)=>{
        setForm({...form, [e.target.name]:e.target.value });
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            if(isLogin){
                const res = await API.post("/users/login", form);
                login(res.data);
                toast.success("Login successful");
                if(res.data.user.role === "student") {
                    navigate("/student-home");
                } else {
                    navigate("/cook-dashboard");
                }
            } else{
                await API.post("/users/register", form);
                toast.success("Registered successfully");
                setIsLogin(true); //switch to login after successful registration
            }
        } catch(error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };
    return(
        <div className="home-container">
            <div className="logo-container">
                <img src={logo} alt="ApniMeal Logo" />
            </div>
            {/* Left side */}
            <div className="home-left">
                <h1>Homemade food, <br/> straight from <span>villages</span></h1>
                <p className="subtitle">Connecting hostel students with real home-cooked meals</p>
                <p className="tagline">No photos. No filters. Just real food.</p>
            </div>
            {/* Right side */}
            <div className="home-right">
                <div className="auth-card">
                    {/* Tabs */}
                    <div className="tabs">
                        <button
                        className={isLogin ? "tab active" : "tab"}
                        onClick={() => setIsLogin(true)}
                        >
                        Login
                        </button>

                        <button
                        className={!isLogin ? "tab active" : "tab"}
                        onClick={() => setIsLogin(false)}
                        >
                        Register
                        </button>
                    </div>

                    {/* Form */}
                    <div className="tab-content">
                        <form onSubmit={handleSubmit}>

                        {!isLogin && (
                            <input
                            name="name"
                            placeholder="Name"
                            onChange={handleChange}
                            />
                        )}

                        <input
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                        />

                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                        />

                        {!isLogin && (
                            <select name="role" onChange={handleChange}>
                            <option value="student">Student</option>
                            <option value="cook">Cook</option>
                            </select>
                        )}

                        <button type="submit" className="primary-btn">
                            {isLogin ? "Login" : "Register"}
                        </button>

                        </form>
                    </div>
                    </div>
            </div>
        </div>
    );
}
export default HomePage;