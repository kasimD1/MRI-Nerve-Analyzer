import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [newUsername, setNewUsername] = useState('');
    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/api/auth/update-username', 
                { newUsername },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            localStorage.setItem('username', res.data.username);
            alert("Name updated successfully!");
            navigate('/dashboard');
        } catch (err) {
            alert("Error updating name");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure? This will permanently delete your account!")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:5000/api/auth/delete-account', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                localStorage.clear(); 
                alert("Account deleted.");
                navigate('/signup'); 
            } catch (err) {
                alert("Could not delete account.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow border-0 p-4">
                        <h3>Profile Settings</h3>
                        <p className="text-muted">Change your display name below.</p>
                        
                        {/* --- Update Form --- */}
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label className="form-label">New Username</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Enter new name"
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="btn btn-success w-100">Update Name</button>
                        </form>

                        {/* --- DANGER ZONE (This must be inside the card) --- */}
                        <div className="mt-5 pt-3 border-top">
                            <p className="text-danger small fw-bold">Danger Zone</p>
                            <button onClick={handleDelete} className="btn btn-danger w-100">
                                Delete My Account
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;