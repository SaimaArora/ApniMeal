import { useEffect, useState } from "react";
import API from "../services/api";
import FoodCard from "../components/FoodCard";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
    const [foods, setFoods] = useState([]); //store food data
    const [search, setSearch] = useState("");
    const [orders, setOrders] = useState([]);
    const activeOrders = orders.filter(
        (o)=>o.status !== "delivered"
    );
    const navigate = useNavigate();
    const fetchOrders = async()=>{
        try{
            const res = await API.get("/orders/my-orders");
            setOrders(res.data.orders);
        } catch(error) {
            console.error(error);
        }
    };
    //fetch food
    const fetchFoods = async ()=>{
        try{
            const res = await API.get("/foods");
            setFoods(res.data.foods);
        } catch(error) {
            console.error(error);
        }
    };

    useEffect(()=>{
        fetchFoods();
        fetchOrders();
    }, []); //runs once when component loads

    //search food
    const handleSearch = async ()=>{
        try{
            const res = await API.get(`/foods/search?keyword=${search}`);
            setFoods(res.data);
        } catch(error) {
            console.error(error);
        }
    };

    //place order
    const handleOrder = async(foodId)=>{
        try{
            await API.post("/orders", { //connect to backend api post/api/orders
                foodId,
                quantity:1
            });
            alert("Order placed!");
        } catch(error) {
            alert(error.response.data.message);
        }
    };

    //add to cart 
    const handleAddToCart = async(foodId)=>{
        try{
            await API.post("/cart", {
                foodId,
                quantity: 1
            });
            navigate("/cart"); //redirect after adding
        } catch(error){
            alert(error.response.data.message);
        }
    }

    return(
        <div>
            <h2>Student Dashboard</h2>
            {/* Search food */}
            <input placeholder="Search food..." value={search} onChange={(e)=> setSearch(e.target.value)}/>
            <button onClick={handleSearch}>Search</button>
             {/*List food  */}
             <button onClick={()=> navigate("/cart")}>
                Go to Cart
             </button>
             <h3>Available Meals</h3>
             <div style={{display:'flex', flexWrap:'wrap'}}>
                {foods.map((food)=>( //loop and render food cards
                    <FoodCard key={food._id} food={food} onAddToCart={handleAddToCart}/>
                ))}
             </div>
                <hr />

                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <h3>🔔 Active Orders</h3>
                    <button 
                        onClick={fetchOrders} 
                        style={{ padding: "5px 10px", cursor: "pointer", borderRadius: "5px" }}
                    >
                        🔄 Check Status
                    </button>
                </div>
                {activeOrders.length === 0 ? <p>No current orders.</p> : activeOrders.map((order) => (
                    <div key={order._id} style={{ border: "2px solid green", margin: "10px", padding: "10px", borderRadius: "5px" }}>
                        <p><strong>Food: {order.foodItem?.title}</strong></p>
                        <p>Cook: {order.cook?.name}</p>
                        <p>Status: <b style={{ color: "orange" }}>{order.status}</b></p>
                    </div>
                ))}

                {/* --- ORDER HISTORY (Delivered) --- */}
                <h3>📜 Order History</h3>
                {orders.filter(o => o.status === "delivered").map((order) => (
                    <div key={order._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px", opacity: 0.7 }}>
                        <p>Food: {order.foodItem?.title}</p>
                        <p>Status: {order.status}</p>
                    </div>
                ))}
             <h3>My Orders</h3>
             {orders.map((order)=>(
                <div key={order._id} style={{ border:"1px solid blue", margin:"10px" }}>
                    <p>Food: {orders.foodItem?.title}</p>
                    <p>Cook: {order.cook?.name}</p>
                    <p>Quantity: {order.quantity}</p>
                    <p>Status: {order.status}</p>
                </div>
             ))}
        </div>
    );
}
export default StudentDashboard;