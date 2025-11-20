// backend/models/User.js

const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
// ... (schema details)
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  account_type: { type: String, enum: ['teacher', 'student'], required: true },
  learner_points: Number,
  level: String,
  achievements: [String],
  courses_bought: [courseProgressSchema],
  avatar: String,
  // ADDED fields for custom password reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;