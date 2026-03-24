import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import CookDashboard from "./pages/CookDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";


function App() {
  const {user} = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Home Page - We are back!</h1>}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        {/* Student dashboard */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute>
            {user?.user?.role === "student"?(
              <StudentDashboard/>
            ): (
              <h2>Access Denied</h2>
            )}
          </ProtectedRoute>
        }/>
        {/* Cook dashboard */}
        <Route path="/cook-dashboard" element={
          <ProtectedRoute>
            {user?.user?.role === "cook"?(
              <CookDashboard/>
            ) : (
              <h2>Access Denied</h2>
            )}
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  );
}
export default App;