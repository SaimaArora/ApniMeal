import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import CookDashboard from "./pages/CookDashboard";
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

function App() {
  const {user} = useContext(AuthContext);
  const {loading} = useContext(AuthContext);

  if(loading) {
    return <p>Loading application...</p>;
  }
  return (
    <Router>
      <Navbar/>
      <Routes>
        
        <Route path="/" element={<h1>Home Page - We are back!</h1>}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        {/* Student dashboard */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute>
            {user?.user?.role === "student"?( //login response is user:{ role:"student"}
              <StudentDashboard/>
            ): (
              <Navigate to="/"/>
            )}
          </ProtectedRoute>
        }/>
        {/* Add to cart */}
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage/>
          </ProtectedRoute>
        }/>
        {/* Cook dashboard */}
        <Route path="/cook-dashboard" element={
          <ProtectedRoute>
            {user?.user?.role === "cook"?(
              <CookDashboard/>
            ) : (
              <Navigate to="/"/>
            )}
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  );
}
export default App;