const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// FIX APPLIED: Ensure validationResult is correctly imported
const { body, validationResult } = require('express-validator'); 
const crypto = require('crypto'); // ADDED: For token generation (used in forgot password)

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_please_change'; 

const getSafeUserData = (user) => ({
    id: user.id,
    email: user.email,
    username: user.username,
    account_type: user.account_type,
    learner_points: user.learner_points,
    level: user.level,
    achievements: user.achievements,
    courses_bought: user.courses_bought,
    avatar: user.avatar || '', // Included for consistency
});

// @route POST /api/auth/register
router.post('/register', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  body('username', 'Username is required').not().isEmpty(),
  body('account_type', 'Account type must be student or teacher').isIn(['student', 'teacher'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password, account_type } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
      account_type,
      learner_points: 0,
      level: 'Beginner',
      achievements: [],
      courses_bought: [],
      avatar: '',
    });

    await user.save();

    const payload = { user: { id: user.id, email: user.email, account_type: user.account_type } };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: getSafeUserData(user) });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error during registration');
  }
});

// @route POST /api/auth/login
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id, email: user.email, account_type: user.account_type } };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: getSafeUserData(user) });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error during login');
  }
});

// @route POST /api/auth/forgot-password - Step 1: Generate Token & "Send Email"
router.post('/forgot-password', [
    body('email', 'Please include a valid email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Use generic success message for security
            return res.json({ message: 'If that email address is registered, you will receive a reset code shortly.' });
        }

        // Generate a 6-digit token (6 random hex characters)
        const token = crypto.randomBytes(3).toString('hex').toUpperCase(); 
        
        // Save the token and 1-hour expiry time
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        // PLACEHOLDER: Prints the reset code to the backend console
        console.log(`\n--- PASSWORD RESET CODE ---\nUser: ${user.email}\nCODE: ${token}\n---------------------------\n`);

        res.json({ message: 'If that email address is registered, you will receive a reset code shortly.' });
        
    } catch (err) {
        console.error('Forgot password error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST /api/auth/reset-password - Step 2/3: Validate Token & Reset Password
router.post('/reset-password', [
    body('token', 'Token is required').not().isEmpty(),
    body('email', 'Email is required').isEmail(), // Added email validation
    body('newPassword', 'Password must be 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    try {
        const { token, email, newPassword } = req.body;

        // Find user by email, token, and ensure the token is not expired
        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset code is invalid or has expired.' });
        }
        
        // Hash and save the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear the reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been successfully reset.' });

    } catch (err) {
        console.error('Reset password error:', err.message);
        res.status(500).send('Server Error');
    }
});


// @route GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        const userPayload = req.auth.user; 
        const user = await User.findById(userPayload.id).select('-password'); 
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;