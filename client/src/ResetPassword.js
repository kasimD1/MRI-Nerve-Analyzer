import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            alert(res.data.message);
            navigate('/login');
        } catch (err) {
            alert("Link expired or invalid.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4 card p-4 shadow-sm">
                    <h4>Set New Password</h4>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="password" 
                            className="form-control mb-3" 
                            placeholder="New Password" 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <button className="btn btn-success w-100">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;