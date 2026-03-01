import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setMessage("User not found or server error.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4 card p-4 shadow-sm">
                    <h4>Forgot Password</h4>
                    <p className="text-muted small">Enter your email to receive a reset link.</p>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            className="form-control mb-3" 
                            placeholder="Email Address" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <button className="btn btn-primary w-100">Send Reset Link</button>
                    </form>
                    {message && <p className="mt-3 text-info text-center">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;