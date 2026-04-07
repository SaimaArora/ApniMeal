import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import {ToastContainer } from "react-toastify"; //to setup toast provider
import "react-toastify/dist/ReactToastify.css"; 
import { Slide } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <App />
    <ToastContainer
    position="bottom-right"
    autoClose={1500}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    draggable
    transition={Slide}/>
  </AuthProvider>
);