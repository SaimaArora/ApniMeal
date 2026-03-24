import { createContext, useState } from "react";

export const AuthContext = createContext(); //creates global state

export const AuthProvider = ({ children })=>{
    const [user, setUser] = useState(null);
    const login = (data)=>{ //stores user in react state and browser storage(persistent)
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
    };

    const logout = ()=>{
        setUser(null); //clears user
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};