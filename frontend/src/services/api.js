import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

export default API;
//so that instead of writing axios.post("https:localhost:5000.../api") 
//we write API.post("/users/login") - > cleaner and scalable