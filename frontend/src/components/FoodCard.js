function FoodCard({ food, onOrder }) {
    return(
        <div style={{ border:"1px solid gray", padding:"10px", margin:"10px" }}>
            <h3>{food.title}</h3>
            <p>{food.description}</p>
            <p>₹{food.price}</p>
            <p>{food.isVeg ? "Veg" : "Non-Veg"}</p>

            <button onClick={()=> onOrder(food._id)}>Order</button>
        </div>
    );
}
export default FoodCard;