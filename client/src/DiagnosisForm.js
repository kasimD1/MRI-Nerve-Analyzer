import React, { useState } from 'react';
import axios from 'axios';

const DiagnosisForm = () => {
    const [patient, setPatient] = useState({ age: '', painLevel: '', foraminalArea: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/predict', patient);
            setResult(res.data);
        } catch (err) {
            alert("Prediction failed. Check if Python is installed.");
        }
        setLoading(false);
    };

    return (
        <div className="card shadow-sm border-0 p-4 mt-4">
            <h4 className="mb-3 text-primary">MRI Nerve Compression Predictor</h4>
            <form onSubmit={handlePredict} className="row g-3">
                <div className="col-md-4">
                    <label className="form-label">Patient Age</label>
                    <input type="number" className="form-control" onChange={(e)=>setPatient({...patient, age: e.target.value})} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Pain Level (1-10)</label>
                    <input type="number" className="form-control" onChange={(e)=>setPatient({...patient, painLevel: e.target.value})} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Foraminal Area (mm²)</label>
                    <input type="number" step="0.1" className="form-control" onChange={(e)=>setPatient({...patient, foraminalArea: e.target.value})} required />
                </div>
                <div className="col-12">
                    <button className="btn btn-dark w-100" disabled={loading}>
                        {loading ? 'Running ML Model...' : 'Generate Second Opinion'}
                    </button>
                </div>
            </form>

            {result && (
                <div className={`alert mt-4 border-start border-4`} style={{borderColor: result.indicator, backgroundColor: '#f8f9fa'}}>
                    <h5>Result: <span style={{color: result.indicator}}>{result.prediction}</span></h5>
                    <p className="mb-0 text-muted italic">Recommendation: {result.recommendation}</p>
                </div>
            )}
        </div>
    );
};

export default DiagnosisForm;