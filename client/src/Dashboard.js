import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DiagnosisForm from './DiagnosisForm'; // <-- 1. Import your new form!

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [activeTab, setActiveTab] = useState('chart'); // Toggle between 'chart' and 'predict'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                setChartData(results.data);
            },
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (!user) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="row">
                {/* --- Left Column: Welcome & Actions --- */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 p-4 mb-4">
                        <h4>Welcome, {user.username}!</h4>
                        <p className="text-muted small">{user.email}</p>
                        <hr />
                        <div className="d-grid gap-2">
                            {/* Navigation Toggles */}
                            <button 
                                onClick={() => setActiveTab('chart')} 
                                className={`btn btn-sm ${activeTab === 'chart' ? 'btn-primary' : 'btn-outline-primary'}`}>
                                Data Visualization
                            </button>
                            <button 
                                onClick={() => setActiveTab('predict')} 
                                className={`btn btn-sm ${activeTab === 'predict' ? 'btn-dark' : 'btn-outline-dark'}`}>
                                AI Prediction Tool
                            </button>
                            <Link to="/profile" className="btn btn-outline-secondary btn-sm">Profile Settings</Link>
                            <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
                        </div>
                    </div>

                    {activeTab === 'chart' && (
                        <div className="card shadow-sm border-0 p-4 animate__animated animate__fadeIn">
                            <h5>Upload Research Data</h5>
                            <p className="small text-muted">Upload a .csv file to visualize</p>
                            <input type="file" accept=".csv" onChange={handleFileUpload} className="form-control form-control-sm" />
                        </div>
                    )}
                </div>

                {/* --- Right Column: Dynamic Content --- */}
                <div className="col-md-8">
                    {activeTab === 'chart' ? (
                        <div className="card shadow-sm border-0 p-4" style={{ minHeight: '400px' }}>
                            <h5>Research Data Visualization</h5>
                            {chartData.length > 0 ? (
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey={Object.keys(chartData[0])[0]} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey={Object.keys(chartData[0])[1]} fill="#007bff" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="text-center mt-5 text-muted">
                                    <p>No data to display. Please upload a CSV file.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="animate__animated animate__fadeIn">
                            {/* --- 2. Render the AI Prediction Form here --- */}
                            <DiagnosisForm />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;