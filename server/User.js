const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    // --- ADD THESE TWO LINES ---
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

// Changed "UserSchema" to "userSchema" to match the variable above
module.exports = mongoose.model('User', userSchema);