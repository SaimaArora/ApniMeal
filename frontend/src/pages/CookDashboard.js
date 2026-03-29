import { useState, useEffect } from "react";
import API from "../services/api";

function CookDashboard(){
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
    const [incomingOrders, setIncomingOrders] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [completeOrders, setCompleteOrders] = useState([]);
    const [cancelledOrders, setCancelledOrders] = useState([]); 
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
                alert("Food updated!");
                setEditingFood(null);
            } else{
                await API.post("/foods", form);
                alert("Food added!");
            }
            //reset form
            setForm({
                title:"",
                description:"",
                price:"",
                isVeg:true
            });
            fetchMyFoods();
        } catch(error){
            alert.error(error.response.data.message);
        }
    };

    const fetchOrders = async ()=>{
        try{
            const res = await API.get("/orders/cook-orders");
            const ordersData = res.data.orders;
            const incoming = ordersData.filter(o=> o.status === "pending");
            const active = ordersData.filter(o=>o.status === "accepted" || o.status === "preparing");
            const completed = ordersData.filter(o=>o.status === "delivered");
            const cancelled = ordersData.filter(o=>o.status === "cancelled");
            
            setIncomingOrders(incoming);
            setActiveOrders(active);
            setCompleteOrders(completed);
            setCancelledOrders(cancelled);

            //calculate stats
            const validOrders = ordersData.filter(o=>o.status !== "cancelled");

            const totalOrders = validOrders.length;
            const pendingOrders = incomingOrders.length;
            const revenue = validOrders.reduce((sum, o)=> sum+o.totalPrice, 0);

            setStats({totalOrders, pendingOrders, revenue});
        } catch (error){
            console.error(error);
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
            alert(error.response.data.message);
        }
    }

    //fetch cooks food
    const fetchMyFoods = async()=>{
        try{
            const res = await API.get("/foods/my-foods");
            setMyFoods(res.data.foods);
        } catch(error) {
            console.error(error);
        }
    }

    const handleDelete = async(id)=>{
        try{
            await API.delete(`/foods/${id}`);
            fetchMyFoods();
        } catch(error) {
            alert(error.response.data.message);
        }
    }
    const toggleAvalability = async(food) =>{
        try{
            await API.put(`/foods/${food._id}`, {
                available: !food.available
            });
            fetchMyFoods();

        } catch(error) {
            alert(error.response.data.message);
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
                return {label: "Mark as preparing", next:"preparing"};
            case "preparing":
                return {label:"Mark as Delivered", next: "delivered"};
            default:
                return null;
        }
    };
    const OrderCard = ({ order }) =>{
        const action = getNextStatus(order.status);
        const isCompleted = order.status === "delivered";
        return (
            <div style={{border:"1px solid gray", margin: "10px"}}>
                <p>Fodd: {order.foodItem?.title}</p>
                <p>Student: {order.student?.name}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Status: {order.status}</p>
                {action && !isCompleted && (
                    <button onClick={()=> updateStatus(order._id, action.next)}>
                        {action.label}
                    </button>
                )}
                {isCompleted && <p>Order Completed</p>}
            </div>
        )
    }

    const renderOrders = ()=>{
        
        let selectedOrders = [];
        switch(activeTab){
            case "incoming":
                selectedOrders = incomingOrders;
                break;
            case "active":
                selectedOrders = activeOrders;
                break;
            case "completed":
                selectedOrders = completeOrders;
                break;
            case "cancelled":
                selectedOrders = cancelledOrders;
                break;
            default:
                selectedOrders = [];
        }
        if(selectedOrders.length === 0) {
            return <p>No orders</p>
        }
        return selectedOrders.map((order)=>(
            <OrderCard key={order._id} order={order}/>
        ));
    };


    return(
        <div>
            <h2>Cook Dashboard</h2>
            <h3>Dashboard Stats</h3>
            <p>Total Orders: {stats.totalOrders}</p>
            <p>Pending Orders: {stats.pendingOrders}</p>
            <p>Revenue: ₹{stats.revenue}</p>

            <h3>{editingFood ? "Edit Food" : "Add Food"}</h3>
            {editingFood && (
                <p style={{color: "blue" }}>
                    Currently Editing: <strong>{editingFood.title}</strong>
                </p>
            )}

            <form onSubmit={handleSubmit}>
                {/* react controls form state */}
                <input name="title" placeholder="Name of food" value={form.title} onChange={handleChange}/> 
                <input name="description" placeholder="Add description of food" value={form.description} onChange={handleChange}/>
                <input name="price" placeholder="Price of food" value={form.price} onChange={handleChange}/>
                <select name="isVeg" onChange={handleChange}>
                    <option value="true">Veg</option>
                    <option value= "false">Non-Veg</option>
                </select>
                <button type="submit">{editingFood ? "Update Food" : "Add Food"}</button>
            </form>

            <div  style={{ margin: "20px 0"}}>
                <button style={{fontWeight:activeTab === "incoming" ? "bold":"normal"}}
                onClick={()=>setActiveTab("incoming")}>Incoming</button>
                <button style={{fontWeight: activeTab ==="active" ? "bold": "normal"}}
                onClick={()=> setActiveTab("active")}>Active</button>
                <button style={{ fontWeight: activeTab === "completed" ? "bold": "normal"}}
                onClick={()=> setActiveTab("completed")}>Completed</button>
                <button style={{fontWeight: activeTab === "cancelled" ? "bold": "normal"}}
                onClick={()=> setActiveTab("cancelled")}>Cancelled</button>
            </div>
            <h3>{activeTab.toUpperCase()} ORDERS</h3>
            {renderOrders()}

            <h3>My Foods</h3>
            {myFoods.map((food)=>(
                <div key={food._id} style={{ border: "1px solid green", margin:"10px"}}>
                    <p>{food.title}</p>
                    <p>₹{food.price}</p>
                    <p>{food.available ? "Available" : "Unavailable"}</p>
                    <button onClick={()=> startEdit(food)}>Edit</button>
                    <button onClick={()=> handleDelete(food._id)}>Delete</button>
                    <button onClick={()=> toggleAvalability(food)}>Toggle Availability</button>
                </div>
            ))}
        </div>
    );
}
export default CookDashboard;