import {useEffect, useState } from "react";
import API from "../services/api";
import {toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

function CartPage(){
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    const navigate = useNavigate();
    const fetchCart = async ()=>{
        try{
            setLoading(true);
            const res = await API.get("/cart");
            setCart(res.data);
        } catch(error) {
            toast.error("Failed to fetch cart");
        } finally {
            setLoading(false);
        }
        
    };
    useEffect(()=>{
        fetchCart();
    }, []);

    const removeItem = async(foodId)=>{
        try{
            await API.delete("/cart", {data:{foodId}});
            fetchCart();
        } catch(err){
            toast.error("Remove failed");
        }
    };
    const handleCheckout = async()=>{
        try{
            setCheckingOut(true);
            await API.post("/cart/checkout");
            toast.success("Order placed successfully!")
            setShowCheckoutModal(false);
            fetchCart();
        } catch(error) {
            toast.error(error.response.data.message || "Checkout failed");  
        } finally {
            setCheckingOut(false);
        }
    };
    const updateQuantity = async(foodId, newQty) =>{
        if(newQty < 1) return removeItem(foodId);
        try{
            await API.put("/cart", {
                foodId,
                quantity: newQty
            });
            fetchCart();
        }
        catch(error) {
            toast.error(error.response.data.message || "Failed to update quantity");
        }
    };
    const confirmCheckout = ()=>{
        if(window.confirm("Place order?")) {
            handleCheckout();
        }
    }
    if(loading) return  <p style={{ padding: "100px" }}>Loading cart...</p>;
    if(!cart || cart.items.length === 0) {
        return(
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <button onClick={()=> navigate("/student-dashboard")}>Browse Food</button>
            </div>
        );
    }
    const total = cart.items.reduce(
        (sum, item) => sum+item.food.price * item.quantity,
        0
    );
    return(
        <div className="cart-container">
            {/* left */}
            <div className="cart-items">
                <h2>Your cart</h2>
                <hr style={{ marginBottom: "20 px", borderColor:"#eee"}}/>
                {cart.items.map((item)=>(
                    <div key={item.food._id} className="cart-card">
                        <div>
                            <h3>{item.food.title}</h3>
                            <div className="qty-controls">
                                <button onClick={()=> updateQuantity(item.food._id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={()=>updateQuantity(item.food._id, item.quantity+1)}>+</button>
                            </div>
                        </div>
                        <div className="item-right">
                            <p>₹{item.food.price * item.quantity}</p>
                            <button className="remove-btn" onClick={()=> removeItem(item.food._id)}>🗑️</button>
                        </div>
                    </div>
                ))}
                <button className="back-btn" onClick={()=> navigate("/student-dashboard")}>← Add More Items</button>
            </div>
            {/* right */}
            <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                    <span>Items Total</span>
                    <span>₹{total}</span>
                </div>
                <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>₹0</span>
                </div>
                <hr/>
                <div className="summary-total">
                    <span>Total</span>
                    <span>₹{total}</span>
                </div>
                <button className="checkout-btn" disabled={checkingOut} onClick={()=> setShowCheckoutModal(true)}>
                    {checkingOut ? "Processing..." : "Place Order"}
                </button>
            </div>
            {showCheckoutModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Confirm Your Order</h3>
                        <p>Total Amount: <strong>₹{total}</strong></p>
                        <div className="modal-buttons">
                            <button onClick={() => setShowCheckoutModal(false)} disabled={checkingOut}>Cancel</button>
                            <button className="confirm-btn" onClick={handleCheckout} disabled={checkingOut}>
                                {checkingOut ? "Confirming..." : "Confirm & Pay"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;