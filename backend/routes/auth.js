const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_please_change'; 

const getSafeUserData = (user) => ({
    id: user.id,
    email: user.email,
    username: user.username,
    account_type: user.account_type,
    learner_points: user.learner_points,
    level: user.level,
    achievements: user.achievements,
    courses_bought: user.courses_bought
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