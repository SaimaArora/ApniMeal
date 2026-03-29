import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar(){
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    return(
        <div style={{ marginBottom:"20px" }}>
            <button onClick={()=> navigate("/")}>Home</button>
            {user && user.user.role === "student" && (
                <button onClick={()=> navigate("/cart")}>Cart</button>
            )}
            {user && (
                <button onClick={logout}>Logout</button>
            )}
        </div>
    );
}
export default Navbar;