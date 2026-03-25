import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req)=>{ //automates instead of adding token everytime
    const user = JSON.parse(localStorage.getItem("user"));
    if(user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
})
export default API;
//so that instead of writing axios.post("https:localhost:5000.../api") 
//we write API.post("/users/login") - > cleaner and scalable