const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./User'); 
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { spawn } = require('child_process'); // Required for Python Bridge

// --- 1. EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'qasimd000@gmail.com',
        pass: 'jyei clba vqxh vdpx'
    }
});

// --- 2. CONNECTION CHECK ---
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Gmail Error: Check your App Password or 2-Step Verification.");
    } else {
        console.log("✅ Gmail System: Ready to send emails!");
    }
});

// --- 3. SIGN UP ROUTE ---
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const token = crypto.randomBytes(32).toString('hex');

        user = new User({ 
            username, 
            email, 
            password: hashedPassword,
            verificationToken: token 
        });
        
        await user.save();

        const mailOptions = {
            from: 'qasimd000@gmail.com',
            to: email,
            subject: 'Verify Your Email',
            text: `Welcome ${username}! Please verify your account: http://localhost:5000/api/auth/verify/${token}`
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: "Registered! Check your email to verify." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// --- 4. EMAIL VERIFICATION ROUTE ---
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        if (!user) return res.status(400).send("Invalid or expired token.");

        user.isVerified = true;
        user.verificationToken = undefined; 
        await user.save();

        res.send("<h1>Email verified successfully! You can now log in.</h1>");
    } catch (err) {
        res.status(500).send("Server error during verification.");
    }
});

// --- 5. LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, "my_super_secret_key", { expiresIn: '1h' });
        res.json({
            token,
            user: { username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// --- 6. PYTHON MACHINE LEARNING BRIDGE (MRI Prediction) ---
router.post('/predict', (req, res) => {
    const patientData = req.body;

    // Start Python process
    const pythonProcess = spawn('python', ['predict.py']);

    // Send data to Python
    pythonProcess.stdin.write(JSON.stringify(patientData));
    pythonProcess.stdin.end();

    let resultData = "";

    pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        try {
            if (resultData) {
                res.json(JSON.parse(resultData));
            } else {
                res.status(500).json({ message: "No data received from Python" });
            }
        } catch (e) {
            console.error("Parse Error:", e);
            res.status(500).json({ message: "Error parsing Python output" });
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });
});

// --- 7. FORGOT & RESET PASSWORD ---
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 900000; 
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions = {
            from: 'qasimd000@gmail.com',
            to: user.email,
            subject: 'Password Reset Request',
            html: `<h3>Reset Your Password</h3><p>Click below to reset. Link expires in 15 mins.</p><a href="${resetUrl}">${resetUrl}</a>`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset link sent to your email!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// --- 8. PROFILE & ACCOUNT MANAGEMENT ---
router.get('/user', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "No token" });
        const decoded = jwt.verify(token, "my_super_secret_key");
        const user = await User.findById(decoded.id).select('username email'); 
        res.json(user); 
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
});

router.put('/update-username', async (req, res) => {
    try {
        const { newUsername } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.verify(token, "my_super_secret_key");
        const updatedUser = await User.findByIdAndUpdate(decoded.id, { username: newUsername }, { new: true });
        res.json({ message: "Username updated!", username: updatedUser.username });
    } catch (err) {
        res.status(500).json({ message: "Failed to update" });
    }
});

router.delete('/delete-account', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.verify(token, "my_super_secret_key");
        await User.findByIdAndDelete(decoded.id);
        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete account" });
    }
});

module.exports = router;