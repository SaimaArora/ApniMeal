import { useState, useContext } from "react";
import API from "../services/api"
import {AuthContext} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function LoginPage() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email:"",
        password:""
    });

    const handleChange = (e) =>{
        setForm({...form, [e.target.name]: e.target.value});
    };
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const res = await API.post("/users/login", form);
            login(res.data);
            if(res.data.user.role === "student") {
                navigate("/student-dashboard");
            } else {
                navigate("/cook-dashboard");
            }
        } catch(error) {
            alert(error.response?.data?.message || "Something is wrong");
        }
    };

    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
                <input name="password" placeholder="Password" value={form.password} type="password" onChange={handleChange}/>
                <button type="submit">Login</button> 
            </form>
        </div>
    );
}
export default LoginPage;