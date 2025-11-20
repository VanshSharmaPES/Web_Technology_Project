const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User'); // Ensure User model is imported
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// ... existing routes (create, etc.) ...

// NEW ROUTE: Get students enrolled in a specific course
router.get('/:id/students', async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Find users who have this courseId in their courses_bought array
    const students = await User.find({
      'courses_bought.course_id': courseId
    }).select('username email level learner_points');

    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to fetch enrolled students" });
  }
});

// ... existing routes (get all, get one, buy, etc.) ...

// Route to create a new course
router.post('/create', upload.single('thumbnail'), async (req, res) => {
  // ... (Keep your existing create logic here) ...
  // Just ensure this file includes the code to handle creation
  try {
      const { title, description, get_points, tags, number_of_videos, email, chapters } = req.body;
      const user = await User.findOne({ email });
      
      const newCourse = new Course({
          title,
          description,
          get_points,
          tags: JSON.parse(tags),
          number_of_videos,
          instructor: {
              name: user.username,
              email: user.email,
              avatar: user.avatar || ''
          },
          chapters: JSON.parse(chapters),
          thumbnail: req.file ? req.file.filename : ''
      });
      
      await newCourse.save();
      res.status(201).json(newCourse);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Route to get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to get specific course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to buy course
router.post('/buy', async (req, res) => {
    const { courseId, userEmail } = req.body;
    try {
        const user = await User.findOne({ email: userEmail });
        const course = await Course.findById(courseId);
        
        if (!user.courses_bought.some(c => c.course_id === courseId)) {
            user.courses_bought.push({
                course_id: courseId,
                percentage_completed: 0,
                number_of_videos_watched: 0,
                course_title: course.title
            });
            user.learner_points += course.get_points;
            await user.save();
        }
        res.json({ message: "Course bought successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;