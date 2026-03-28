import {useEffect, useState } from "react";
import API from "../services/api";

function CartPage(){
    const [cart, setCart] = useState(null);
    const fetchCart = async ()=>{
        const res = await API.get("/cart");
        setCart(res.data);
    };
    useEffect(()=>{
        fetchCart();
    }, []);

    const removeItem = async(foodId)=>{
        await API.delete("/cart", {data:{foodId}});
        fetchCart();
    };
    const handleCheckout = async()=>{
        await API.post("/cart/checkout");
        alert("Order palced!");
        fetchCart();
    };
    if(!cart) return <p>Loading...</p>
    return(
        <div>
            <h2>My Cart</h2>
            {
                cart.items.map((item)=>(
                    <div key={item.food._id}>
                        <p>{item.food.title}</p>
                        <p>Qty: {item.quantity}</p>
                        <button onClick={()=> removeItem(item.food._id)}>Remove</button>
                    </div>
                ))
            }
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    )
}

export default CartPage;