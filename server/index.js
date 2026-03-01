require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('node:dns');
const authRoutes = require('./auth');

// Force DNS for more reliable database connection on some hosts
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

// --- 1. Middleware ---
app.use(express.json());

// UPDATE: Allow both Localhost (for testing) and your future Render URL
const allowedOrigins = [
  'http://localhost:3000', 
  'https://mri-nerve-analyzer.onrender.com' // Replace with your actual Render URL later
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// --- 2. Routes ---
app.use('/api/auth', authRoutes);

// --- 3. Database Connection ---
// Use the Environment Variable for security!
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://qasimd000_db_user:mHMedwUZJbrQaG3Y@cluster0.atpvsk6.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Database Connected!"))
    .catch(err => console.error("❌ Connection Error:", err));

// --- 4. Start the Server ---
// UPDATE: Use process.env.PORT so Render can assign its own port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});