import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

// PAGES
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import CookDashboard from "./pages/CookDashboard";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import OrderHistory from "./pages/OrderHistory";
import StudentHomePage from "./pages/StudentHomePage";

// COMPONENTS
import Navbar from "./components/Navbar"; // Ensure Navbar.js has 'export default Navbar'
import ProtectedRoute from "./components/ProtectedRoute";

// CONTEXT
import { AuthContext } from "./context/AuthContext";

function App() {
  const {user} = useContext(AuthContext);
  const {loading} = useContext(AuthContext);

  if(loading) {
    return <p>Loading application...</p>;
  }
  return (
    <Router>
      {user && <Navbar/>}
      <Routes>
        
        <Route path="/" element={<HomePage/>}/>
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
        {/* Student orders */}
        <Route path="/student-dashboard/orders" element={
          <ProtectedRoute>
            {user?.user?.role === "student" ? (
              <OrderHistory/>
            ):(
              <Navigate to="/"/>
            )}
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
        {/* Student home page */}
        <Route path="/student-home" element={
          <ProtectedRoute>
            {user?.user?.role === "student"?(
              <StudentHomePage/>
            ):(
              <Navigate to="/"/>
            )}
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  );
}
export default App;