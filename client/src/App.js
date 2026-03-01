import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';
import Profile from './Profile'; 
import ProtectedRoute from './ProtectedRoute';
import ForgotPassword from './ForgotPassword'; 
import ResetPassword from './ResetPassword';   

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">MERN Auth App</Link>
            <div>
              <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/signup">Register</Link>
            </div>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            {/* --- THESE WERE MISSING --- */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* ------------------------- */}

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;