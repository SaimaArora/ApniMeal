import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function RegisterPage() {
    const {login} = useContext(AuthContext);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });

    const handleChange = (e) =>{
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const res = await API.post("/users/register", form);
            login(res.data.user);
            alert("Registered successfully");
        } catch(error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    return(
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange}/>
                <input name="email" placeholder="Email" onChange={handleChange}/>
                <input name="password" placeholder="Password" type="password" onChange={handleChange}/>

                <select name="role" onChange={handleChange}>
                    <option value = "student">Student</option>
                    <option value="cook">Cook</option>
                </select>

                <button type="submit">Register</button>
            </form>
        </div>
    )

}
export default RegisterPage;