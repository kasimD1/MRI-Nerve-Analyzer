import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            alert(res.data.message);
            navigate('/login'); 
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Create Account</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input type="text" className="form-control" placeholder="Full Name" 
                                        onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" placeholder="email@example.com" 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" placeholder="••••••••" 
                                        onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;