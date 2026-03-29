import {useEffect, useState } from "react";
import API from "../services/api";
import {toast } from "react-toastify";

function CartPage(){
    const [error, setError] = useState(null);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);

    const fetchCart = async ()=>{
        try{
            setError(null);
            setLoading(true);
            const res = await API.get("/cart");
            setCart(res.data);
        } catch(error) {
            setError("Failed to load cart");
        } finally {
            setError(null);
            setLoading(false);
        }
        
    };
    useEffect(()=>{
        fetchCart();
    }, []);

    const removeItem = async(foodId)=>{
        await API.delete("/cart", {data:{foodId}});
        fetchCart();
    };
    const handleCheckout = async()=>{
        try{
            setCheckingOut(true);
            await API.post("/cart/checkout");
            toast.success("Order placed successfully!")
            fetchCart();
        } catch(error) {
            toast.error(error.response.data.message || "Checkout failed");  
        } finally {
            setCheckingOut(false);
        }
    };
    const updateQuantity = async(foodId, newQty) =>{
        try{
            setUpdating(true);
            await API.put("/cart", {
                foodId,
                quantity: newQty
            });
            fetchCart();
        }
        catch(error) {
            toast.error(error.response.data.message || "Failed to update quantity");
        } finally{
            setUpdating(false);
        }
    };
    const confirmCheckout = ()=>{
        if(window.confirm("Place order?")) {
            handleCheckout();
        }
    }
    if(loading) return <p>Loading cart...</p>
    if(error) return <p>{error}</p>
    {cart.items.length===0 &&<p>Your cart is empty</p>}
    return(
        <div>
            <h2>My Cart</h2>
                {cart.items.map((item)=>(
                    item.food ? (
                    <div key={item.food._id}>
                        <p>{item.food.title}</p>
                        <div>
                            <button disabled={updating} onClick={()=> updateQuantity(item.food._id, item.quantity - 1)}>-</button>
                            <span style={{ margin: "0 10px"}}>{item.quantity}</span>
                            <button disabled={updating} onClick={()=>updateQuantity(item.food._id, item.quantity+1)}>+</button>
                        </div>
                        <button disabled={updating} onClick={()=> removeItem(item.food._id)}>Remove</button>
                    </div>
                ): null ))}
            
            <button disabled={checkingOut} onClick={confirmCheckout}>
               {checkingOut ? "Processing...":"Checkout"}
            </button>
        </div>
    )
}

export default CartPage;