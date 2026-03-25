import { useEffect, useState } from "react";
import API from "../services/api";
import FoodCard from "../components/FoodCard";

function StudentDashboard() {
    const [foods, setFoods] = useState([]); //store food data
    const [search, setSearch] = useState("");

    //fetch food
    const fetchFoods = async ()=>{
        try{
            const res = await API.get("/foods");
            setFoods(res.data);
        } catch(error) {
            console.error(error);
        }
    };

    useEffect(()=>{
        fetchFoods();
    }, []); //runs once when component loads

    //search food
    const handleSearch = async ()=>{
        try{
            const res = await API.get(`/foods/search?keyword=${search}`);
            setFoods(res.data);
        } catch(error) {
            console.error(error);
        }
    };

    //place order
    const handleOrder = async(foodId)=>{
        try{
            await API.post("/orders", { //connect to backend api post/api/orders
                foodId,
                quantity:1
            });
            alert("Order placed!");
        } catch(error) {
            alert(error.response.data.message);
        }
    };
    return(
        <div>
            <h2>Student Dashboard</h2>
            {/* Search food */}
            <input placeholder="Search food..." value={search} onChange={(e)=> setSearch(e.target.value)}/>
            <button onClick={handleSearch}>Search</button>
             {/*List food  */}
             {foods.map((food)=>( //loop and render food cards
                <FoodCard key={food._id} food={food} onOrder={handleOrder}/>
             ))}
        </div>
    );
}
export default StudentDashboard;