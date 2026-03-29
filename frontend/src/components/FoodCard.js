function FoodCard({ food, onAddToCart }) {
    return(
        <div style={{ border:"1px solid gray", padding:"10px", margin:"10px" }}>
            <h3>{food.title}</h3>
            <p>{food.description}</p>
            <p>₹{food.price}</p>
            <p>{food.isVeg ? "Veg" : "Non-Veg"}</p>

            <button onClick={()=> onAddToCart(food._id)}>Add to Cart</button>
        </div>
    );
}
export default FoodCard;
//use it in home page, dashboard, search results
