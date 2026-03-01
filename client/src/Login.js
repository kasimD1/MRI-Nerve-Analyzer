import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Added Link here

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.user.username); 
            navigate('/dashboard'); 
        } catch (err) {
            // Updated alert to be more specific (e.g., if not verified)
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Login</h2>
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-bold">Email address</label>
                                    <input type="email" className="form-control shadow-sm" placeholder="name@example.com" 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-bold">Password</label>
                                    <input type="password" className="form-control shadow-sm" placeholder="••••••••" 
                                        onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                                </div>
                                
                                {/* --- NEW: Forgot Password Link --- */}
                                <div className="text-end mb-4">
                                    <Link to="/forgot-password" size="sm" className="text-decoration-none small text-primary">
                                        Forgot password?
                                    </Link>
                                </div>

                                <button type="submit" className="btn btn-dark w-100 py-2 shadow">Sign In</button>
                            </form>
                            
                            <div className="mt-4 text-center">
                                <p className="small text-muted">Don't have an account? <Link to="/signup" className="text-decoration-none">Register</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;