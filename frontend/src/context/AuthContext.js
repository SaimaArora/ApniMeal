import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(); //creates global state

export const AuthProvider = ({ children })=>{
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if(storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    },[]); //page refresh, user still logged in now
    const login = (data)=>{ //stores user in react state and browser storage(persistent)
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
    };

    const logout = ()=>{
        setUser(null); //clears user
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};