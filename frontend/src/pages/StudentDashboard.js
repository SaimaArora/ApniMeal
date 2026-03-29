import { useEffect, useState } from "react";
import API from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import FoodCard from "../components/FoodCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Skeleton from "../components/Skeleton";
import "../styles/dashboard.css"
import logo from "../assets/logo.png";

function StudentDashboard() {
    const [error, setError] = useState(null);
    const [foods, setFoods] = useState([]); //store food data
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [adding, setAdding] = useState(false);
    const { logout } = useContext(AuthContext);
    //fetch food
    const fetchFoods = async ()=>{
        try{
            setLoading(true);
            setError(null);
            const res = await API.get("/foods");
            setFoods(res.data.foods);
        } catch(error) {
            setError("Failed to fetch foods.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchFoods();
    }, []); //runs once when component loads


    //add to cart 
    const handleAddToCart = async(foodId)=>{
        try{
            setAdding(true);
            await API.post("/cart", {
                foodId,
                quantity: 1
            });
            toast.success("Added to cart!");
            // navigate("/cart"); //redirect after adding
        } catch(error){
            toast.error(error.response.data.message);
        } finally{
            setAdding(false);
        }
    }
    const filteredFoods = foods.filter((food)=>
        food.title.toLowerCase().includes(search.toLowerCase())
    );
    if(loading) return (
        <div>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/> 
        </div>
    );
    if(error) return <p>{error}</p>;
    if(foods.length === 0) return <p>No food available.</p>;
    return(
        <div className="dashboard-container">
            <div className="navbar">
                <img src={logo} alt="ApniMeal Logo" className="logo"/>
                <input type="text" placeholder="Search dishes like 'rajma', 'dal'..." className="search-bar" value={search} onChange={(e)=> setSearch(e.target.value)}/>
                <div className="nav-actions">
                    <button onClick={()=> navigate("/cart")}>🛒</button>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
            {/* food list */}
            <div className="food-list">
                {filteredFoods.map((food)=>(
                    <div key={food._id} className="food-card">
                        <div className={`veg-indicator ${
                            food.isVeg ? "veg" : "non-veg"
                        }`} />
                        <div className="card-right">
                            <p className="price">₹{food.price}</p>
                            <button className="cart-btn" disabled={adding} onClick={()=> handleAddToCart(food._id)}>🛒</button>
                        </div>
                        <h3>{food.title}</h3>
                        <p className="desc">{food.description}</p>
                        <p className="cook">Cook: {food.cook?.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default StudentDashboard;