import { useState, useEffect } from "react";
import API from "../services/api";

function CookDashboard(){
    const [form, setForm] = useState({
        title:"",
        description:"",
        price:"",
        isVeg:true
    });

    const [orders, setOrders] = useState([]);
    //handle form input
    const handleChange = (e)=>{
        const value = e.target.name === "isVeg"?e.target.value === "true":e.target.value;
        setForm({ ...form, [e.target.name] : value });
    };

    //submit food
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            await API.post("/foods", form);
            alert("Food added!");

            //reset form
            setForm({
                title:"",
                description:"",
                price:"",
                isVeg:true
            });
        } catch(error){
            alert.error(error.response.data.message);
        }
    };

    const fetchOrders = async ()=>{
        try{
            const res = await API.get("/orders/cook-orders");
            setOrders(res.data);
        } catch(error){
            console.error(error);
        }
    };

    useEffect(()=>{
        fetchOrders(); //fetch data automatically
    },[]);

    const updateStatus = async(orderId, status) =>{
        try{
            await API.put(`/orders/${orderId}/status`, {status});
            fetchOrders(); //refresh
        } catch(error){
            alert(error.response.data.message);
        }
    }

    return(
        <div>
            <h2>Cook Dashboard</h2>
            <h3>Add Food</h3>
            <form onSubmit={handleSubmit}>
                {/* react controls form state */}
                <input name="title" placeholder="Name of food" value={form.title} onChange={handleChange}/> 
                <input name="description" placeholder="Add description of food" value={form.description} onChange={handleChange}/>
                <input name="price" placeholder="Price of food" value={form.price} onChange={handleChange}/>
                <select name="isVeg" onChange={handleChange}>
                    <option value="true">Veg</option>
                    <option value= "false">Non-Veg</option>
                </select>
                <button type="submit">Add Food</button>
            </form>

            <h3>Incoming Orders</h3>
            {orders.map((order)=>(
                <div key={order._id} style={{border:"1px solid gray", margin:"10px"}}>
                    <p>Food: {order.foodItem?.title}</p>
                    <p>Student: {order.student?.name}</p>
                    <p>Quantity: {order.quantity}</p>
                    <p>Status: {order.status}</p>
                    <button onClick={()=> updateStatus(order._id, "accepted")}>
                        Accept
                    </button>
                    <button onClick={()=> updateStatus(order._id, "preparing")}>
                        Preparing
                    </button>
                    <button onClick={()=> updateStatus(order._id, "delivered")}>
                        Delivered
                    </button>
                </div>
            ))}
        </div>
    );
}
export default CookDashboard;