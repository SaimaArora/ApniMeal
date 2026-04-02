import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/cook.css";

function CookDashboard(){
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        if(Number(form.price) <= 0) {
            toast.error("Price must be greater than zero");
            return;
        }
        try{
            if(editingFood){
                await API.put(`/foods/${editingFood._id}`, form);
                toast.success("Food updated!");
                setIsModalOpen(false);
            } else{
                await API.post("/foods", form);
                toast.success("Food added!");
            }
            resetForm();
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

    const updateStatus = async(order, status) =>{
        
            console.log("CURRENT:", order.status);
console.log("REQUESTED:", status);
        try{
            await API.put(`/orders/${order._id}/status`, {status});
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
                return filteredOrders.filter(o =>
                    ["accepted", "preparing"].includes(o.status)
                );

            case "completed":
                return filteredOrders.filter(o => o.status === "completed");
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
    const startEdit = (food) => {
        setEditingFood(food);
        setForm({
            title: food.title,
            description: food.description,
            price: food.price,
            isVeg: food.isVeg
        });

        setIsModalOpen(true); // 🔥 open modal
    };
    const getNextStatus = (currentStatus) => {
        switch(currentStatus) {
            case "pending":
                return { label: "Accept", next: "accepted" };

            case "accepted":
                return { label: "Start Preparing", next: "preparing" };

            case "preparing":
                return { label: "Mark Completed", next: "completed" };

            default:
                return null;
        }
    };

    const resetForm = ()=>{
        setEditingFood(null);
        setForm({
            title: "",
            description:"",
            price:"",
            isVeg:true
        });
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
                    <div className="orders-grid">
                    {getTabOrders().map(order => {
                        const action = getNextStatus(order.status);
                        return (
                            <div className="order-card" key={order._id}>
                                <div className="order-top">
                                    <h3>{order.foodItem?.title}</h3>
                                    <span className={`status-badge ${order.status}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-details">
                                    <p><strong>Student:</strong> {order.student?.name}</p>
                                    <p><strong>Quantity:</strong> {order.quantity}</p>
                                    <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                                </div>

                                {action && (
                                    <button 
                                        className="primary-btn order-action-btn"
                                        onClick={() => updateStatus(order, action.next)}
                                    >
                                        {action.label}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    </div>
                ) : (
                    <>
                        <div className="foods-section">
                            {/* FOOD CARDS */}
                            <h3 className="section-title">Your Dishes</h3>
                            <div className="food-grid">
                                {myFoods.length === 0 ? (
                                    <div className="empty-state">
                                        <h3>No dishes added yet 🍽️</h3>
                                        <p>Start by adding your first dish below</p>
                                    </div>
                                ) : (
                                    myFoods.map(food => (
                                        <div className="food-card" key={food._id}>
                                        <div className="food-header">
                                            <h4>{food.title}</h4>
                                            <span className={food.isVeg ? "veg-tag" : "nonveg-tag"}>
                                                {food.isVeg ? "Veg" : "Non-Veg"}
                                            </span>
                                        </div>

                                        <p className="food-desc">{food.description}</p>

                                        <div className="food-meta">
                                            <span className="price-tag">₹{food.price}</span>
                                            <span className={food.available ? "available" : "not-available"}>
                                                {food.available ? "● Available" : "● Unavailable"}
                                            </span>
                                        </div>

                                        <div className="food-actions">
                                            <button 
                                                className="edit-btn" 
                                                onClick={() => startEdit(food)}
                                            >
                                                Edit
                                            </button>

                                            <button 
                                                className="delete-btn" 
                                                onClick={() => handleDelete(food._id)}
                                            >
                                                Delete
                                            </button>

                                            <button 
                                                className="toggle-btn" 
                                                onClick={() => toggleAvailability(food)}
                                            >
                                                {food.available ? "Disable" : "Enable"}
                                            </button>
                                        </div>
                                    </div>
                                )))}
                            </div>

                            {/* ADD FOOD FORM */}
                            <div className="food-form-card">
                                <h3>Add New Dish</h3>

                                <form className="food-form" onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Dish Name</label>
                                            <input
                                                name="title"
                                                value={form.title}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Description</label>
                                            <input
                                                name="description"
                                                value={form.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Price</label>
                                            <input
                                                name="price"
                                                type="number"
                                                value={form.price}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Category</label>
                                            <select
                                                name="isVeg"
                                                value={form.isVeg}
                                                onChange={handleChange}
                                            >
                                                <option value="true">Veg</option>
                                                <option value="false">Non-Veg</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button className="primary-btn" type="submit">
                                            Add Food
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* ✅ MODAL OUTSIDE */}
                        {isModalOpen && (
                            <div className="modal-overlay">
                                <div className="modal">
                                    <h3>Edit Dish</h3>

                                    <form onSubmit={handleSubmit} className="food-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Dish Name</label>
                                                <input
                                                    name="title"
                                                    value={form.title}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Description</label>
                                                <input
                                                    name="description"
                                                    value={form.description}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Price</label>
                                                <input
                                                    name="price"
                                                    type="number"
                                                    value={form.price}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Category</label>
                                                <select
                                                    name="isVeg"
                                                    value={form.isVeg}
                                                    onChange={handleChange}
                                                >
                                                    <option value="true">Veg</option>
                                                    <option value="false">Non-Veg</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button className="primary-btn" type="submit">
                                                Update Food
                                            </button>

                                            <button
                                                type="button"
                                                className="secondary-btn"
                                                onClick={() => {
                                                    setIsModalOpen(false);
                                                    resetForm();
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
                </div>
        </div>
    );
}
export default CookDashboard;