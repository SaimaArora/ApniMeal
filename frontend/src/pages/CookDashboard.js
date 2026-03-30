import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/cook.css";

function CookDashboard(){
    const {user} = useContext(AuthContext);
    const {logout} = useContext(AuthContext);
    const [myFoods, setMyFoods] = useState([]);
    const [editingFood, setEditingFood] = useState(null);
    const [form, setForm] = useState({
        title:"",
        description:"",
        price:"",
        isVeg:true
    });
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        revenue: 0
    });

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("incoming");
    //handle form input
    const handleChange = (e)=>{
        const value = e.target.name === "isVeg"?e.target.value === "true":e.target.value;
        setForm({ ...form, [e.target.name] : value });
    };

    //submit food
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            if(editingFood){
                await API.put(`/foods/${editingFood._id}`, form);
                toast.success("Food updated!");
            } else{
                await API.post("/foods", form);
                toast.success("Food added!");
            }
            setEditingFood(null);
            //reset form
            setForm({
                title:"",
                description:"",
                price:"",
                isVeg:true
            });
            fetchMyFoods();
        } catch(error){
            toast.error("Action Failed");
        }
    };

    const fetchOrders = async ()=>{
        try{
            const res = await API.get("/orders/cook-orders");
            const data = res.data.orders;
            setOrders(data);
            
            const valid = data.filter(o=>o.status!=="cancelled");
            

            //calculate stats
            setStats({totalOrders: valid.length,
                 pendingOrders: valid.filter(o=>o.status === "pending").length,
                  revenue: valid.reduce((sum, o)=> sum+o.totalPrice, 0)
            });
        } catch (error){
            toast.error(error.response?.data?.message);
        }
    };

    useEffect(()=>{
        fetchOrders(); //fetch data automatically
        fetchMyFoods();
    },[]);

    const updateStatus = async(orderId, status) =>{
        try{
            await API.put(`/orders/${orderId}/status`, {status});
            fetchOrders(); //refresh
        } catch(error){
            toast.error(error.response?.data?.message);
        }
    }

    const getTabOrders =()=>{
        switch(activeTab){
            case "incoming":
                return filteredOrders.filter(o=> o.status === "pending");
            case "active":
                return filteredOrders.filter(o=>
                    ["accepted", "preparing", "delivering"].includes(o.status)
                );
            case "completed":
                return filteredOrders.filter(o=> o.status === "delivered");
            case "cancelled":
                return filteredOrders.filter(o=> o.status === "cancelled");
            default:
                return [];
        }
    }

    //fetch cooks food
    const fetchMyFoods = async()=>{
        try{
            const res = await API.get("/foods/my-foods");
            setMyFoods(res.data.foods);
        } catch(error) {
            toast.error(error.response?.data?.message);
        }
    }

    const filteredOrders =orders.filter((o)=>
    o.foodItem?.title.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = async(id)=>{
        if(!window.confirm("Are you sure you want to delete this food?")) return;
        try{
            await API.delete(`/foods/${id}`);
            fetchMyFoods();
        } catch(error) {
            toast.error(error.response?.data?.message);
        }
    }
    const toggleAvailability = async (food) => {
        try {
            await API.put(`/foods/${food._id}`, {
            available: !food.available
            });

            fetchMyFoods();

        } catch {
            toast.error("Failed to update availability");
        }
    };

    const startEdit = (food) =>{
        setEditingFood(food);
        setForm({
            title: food.title,
            description:food.description,
            price:food.price,
            isVeg:food.isVeg
        });
    };
    const getNextStatus = (currentStatus) => {
        switch(currentStatus) {
            case "pending":
                return { label: "Accept", next: "accepted"};
            case "accepted" :
                return {label: "Preparing", next:"preparing"};
            case "preparing":
                return {label:"Out for Delivery", next: "delivering"};
            case "delivering":
                return {label: "Mark Delivered", next: "delivered"};
            default:
                return null;
        }
    };


 return (
        <div className="cook-container">
            <div className="navbar">
                <img src={logo} alt="Logo" className="logo" />
                <input 
                    className="search-bar" 
                    placeholder="Search orders..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                />
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>

            <h2 className="greeting">
                Hi, {user?.user?.name} 👋
            </h2>

            {/* stats */}
            <div className="stats">
                <div className="stat-card">
                    <p>Total Orders</p>
                    <h2>{stats.totalOrders}</h2>
                </div>
                <div className="stat-card">
                    <p>Pending</p>
                    <h2>{stats.pendingOrders}</h2>
                </div>
                <div className="stat-card">
                    <p>Revenue</p>
                    <h2>₹{stats.revenue}</h2>
                </div>
            </div>

            {/* tabs */}
            <div className="tabs">
                {["incoming", "active", "completed", "cancelled", "foods"].map(tab => (
                    <button 
                        key={tab} 
                        className={`tab ${activeTab === tab ? "active" : ""}`} 
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* content */}
            <div className="content">
                {activeTab !== "foods" ? (
                    getTabOrders().map(order => {
                        const action = getNextStatus(order.status);
                        return (
                            <div className="order-card" key={order._id}>
                                <div className="order-info">
                                    <h3>{order.foodItem?.title}</h3>
                                    <p>Student: {order.student?.name}</p>
                                    <p>Qty: {order.quantity}</p>
                                </div>
                                {action && (
                                    <button className="primary-btn" onClick={() => updateStatus(order._id, action.next)}>
                                        {action.label}
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="foods-section">
                        <div className="food-form-card">
                            <h3>{editingFood ? "Edit Food" : "Add New Dish"}</h3>
                            {editingFood && (
                                <p className="editing-text">
                                    Editing: <strong>{editingFood.title}</strong>
                                </p>
                            )}
                            <form onSubmit={handleSubmit}>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Dish name" required
                                />
                                <input
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Short description" required
                                />
                                <input
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="Price" required
                                />
                                <select name="isVeg" value={form.isVeg} onChange={handleChange}>
                                    <option value="true">Veg</option>
                                    <option value="false">Non-Veg</option>
                                </select>

                                <button className="primary-btn" type="submit">
                                    {editingFood ? "Update Food" : "Add Food"}
                                </button>
                                {editingFood && (
                                    <button type="button" className="secondary-btn" onClick={() => setEditingFood(null)}>
                                        Cancel
                                    </button>
                                )}
                            </form>
                        </div>

                        <div className="food-grid">
                            {myFoods.map(food => (
                                <div className="food-card" key={food._id}>
                                    <h4>{food.title}</h4>
                                    <p className="price-tag">₹{food.price}</p>
                                    <p className={food.available ? "available" : "not-available"}>
                                        {food.available ? "● Available" : "● Unavailable"}
                                    </p>
                                    <div className="food-actions">
                                        <button className="edit-btn" onClick={() => startEdit(food)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(food._id)}>Delete</button>
                                        <button className="toggle-btn" onClick={() => toggleAvailability(food)}>Toggle</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default CookDashboard;