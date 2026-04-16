import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
// PAGES
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

function App(){
  
  const {user, loading} = useContext(AuthContext);
  if(loading) {
    return <p>Loading application...</p>;
  }
  return(
    <Router>
      <AppContent user ={user}/>
    </Router>
  );
}

function AppContent({user}) {
  const location = useLocation();

  const hideNavbarRoutes = ["/"];
  const shouldShowNavbar = user && !hideNavbarRoutes.includes(location.pathname);
 
  return (
    <>
      {shouldShowNavbar && <Navbar/>}
      <Routes>
        
        <Route path="/" element={<HomePage/>}/>
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
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
export default App;