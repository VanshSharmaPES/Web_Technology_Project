const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { expressjwt: jwt } = require('express-jwt');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth'); // Ensure this file exists in routes folder

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define public paths (authentication and public content)
const publicPaths = [
    '/api/auth/register',
    '/api/auth/login',
    '/api/users/recommended', 
    { url: '/uploads/.*', methods: ['GET'] },
    { url: /^\/api\/courses\/[^/]+$/, methods: ['GET'] }, 
];

// Apply JWT middleware
app.use(
    jwt({ 
      secret: process.env.JWT_SECRET || 'your_fallback_secret_key_please_change', 
      algorithms: ['HS256'] 
    }).unless({ path: publicPaths })
);

// ERROR Handling Middleware for JWT authentication errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ message: 'Invalid Token' });
  }
  next();
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// Start the server on Port 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));