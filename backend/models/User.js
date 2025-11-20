const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  course_id: String,
  percentage_completed: Number,
  number_of_videos_watched: Number,
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Added required: true
  email: { type: String, required: true, unique: true }, // Added required: true and unique: true
  password: { type: String, required: true }, // Added field for HASHED password
  account_type: { type: String, enum: ['teacher', 'student'], required: true },
  learner_points: Number,
  level: String,
  achievements: [String],
  courses_bought: [courseProgressSchema],
});

// Check if the 'User' model is already defined and avoid overwriting it
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;