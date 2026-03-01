require('dotenv').config();

// Then change your transporter to:
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Node to use Google/Cloudflare DNS

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./auth'); // Link to your auth file

const app = express();

// 1. Middleware: Allows your server to understand JSON
app.use(express.json());
app.use(cors());

// 2. Use your Auth Routes
app.use('/api/auth', authRoutes);

// 3. Connect to MongoDB (Replace the link below with yours from Atlas)
const MONGO_URI = "mongodb+srv://qasimd000_db_user:mHMedwUZJbrQaG3Y@cluster0.atpvsk6.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Database Connected!"))
    .catch(err => console.error("❌ Connection Error:", err));

// 4. Start the Server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));

const cors = require('cors');

// This allows your React app (on port 3000) to talk to your Server (on port 5000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));