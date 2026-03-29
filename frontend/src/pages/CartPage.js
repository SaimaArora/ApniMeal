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
    const updateQuantity = async(foodId, newQty) =>{
        try{
            await API.put("/cart", {
                foodId,
                quantity: newQty
            });
            fetchCart();
        }
        catch(error) {
            alert(error.response.data.message);
        }
    })
    if(!cart) return <p>Loading...</p>
    return(
        <div>
            <h2>My Cart</h2>
                {cart.items.map((item)=>(
                    item.food ? (
                    <div key={item.food._id}>
                        <p>{item.food.title}</p>
                        <div>
                            <button onClick={()=> updateQuantity(item.food._id, item.quantity - 1)}>-</button>
                            <span style={{ margin: "0 10px"}}>{item.quantity}</span>
                            <button onClick={()=>updateQuantity(item.food._id, item.quantity+1)}>+</button>
                        <button onClick={()=> removeItem(item.food._id)}>Remove</button>
                    </div>
                ): null ))}
            
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    )
}

export default CartPage;