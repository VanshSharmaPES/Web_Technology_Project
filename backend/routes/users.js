const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Middleware to fetch user details by email
const getUserMiddleware = async (req, res, next) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

// Helper to calculate course progress
const calculateCourseProgress = (course, courseProgress) => {
  const totalVideos = course.number_of_videos || 0;
  const videosWatched = courseProgress.number_of_videos_watched || 0;
  const percentageCompleted = totalVideos > 0 ? (videosWatched / totalVideos) * 100 : 0;

  return {
    ...courseProgress,
    percentage_completed: percentageCompleted,
    course_title: course.title || "Untitled Course",
  };
};

// Route to fetch courses created by the logged-in teacher
router.get('/created/:email', getUserMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (user.account_type !== 'teacher') {
      return res.status(403).json({ message: "Only teachers can view created courses" });
    }

    const createdCourses = await Course.find({ "instructor.name": user.username });

    res.status(200).json({ created_courses: createdCourses });
  } catch (err) {
    console.error("Error fetching created courses:", err.message);
    res.status(500).json({ message: "Failed to fetch created courses" });
  }
});

// Route to fetch user data and courses bought by the user
router.get('/user/:email', getUserMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userCourses = user.courses_bought || [];
    const courseIds = userCourses.map((c) => c.course_id);

    const courses = await Course.find({ _id: { $in: courseIds } });

    const coursesProgress = userCourses.map((courseProgress) => {
      const course = courses.find((c) => String(c._id) === String(courseProgress.course_id));
      return course ? calculateCourseProgress(course, courseProgress) : null;
    });

    const response = {
      username: user.username || "Guest",
      email: user.email,
      account_type: user.account_type || "student",
      learner_points: user.learner_points || 0,
      level: user.level || "Beginner",
      achievements: user.achievements || [],
      courses_bought: coursesProgress.filter((c) => c !== null),
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

// Route to fetch all courses (for recommendations)
router.get('/recommended', async (req, res) => {
  try {
    const courses = await Course.find({}).limit(10); // Limit to 10 courses for recommendation
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching recommended courses:", err.message);
    res.status(500).json({ message: "Failed to fetch recommended courses" });
  }
});

// Existing routes...

router.post('/create',upload.single('thumbnail'),
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('title').notEmpty().withMessage('Course title is required'),
    body('description').notEmpty().withMessage('Course description is required'),
    body('get_points').isInt({ min: 0 }).withMessage('Points must be a non-negative integer'),
    body('chapters').isArray().withMessage('Chapters must be an array'),
  ],
  async (req, res) => {
    console.log('Received request to create course...');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors found:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, title, description, get_points, tags, number_of_videos, chapters } = req.body;

      const user = await User.findOne({ email });
      if (!user || user.account_type !== 'teacher') {
        return res.status(403).json({ message: 'Only teachers can create courses' });
      }

      const normalizedChapters = JSON.parse(chapters).map((chapter) => ({
        ...chapter,
        topics: chapter.topics.map((topic) => ({
          ...topic,
          videoThumbnail: topic.videoThumbnail || '',
        })),
      }));

      const newCourse = new Course({
        title,
        description,
        get_points: parseInt(get_points, 10),
        instructor: { name: user.username, avatar: user.avatar || '' },
        tags: JSON.parse(tags),
        number_of_videos: parseInt(number_of_videos, 10),
        thumbnail: req.file ? req.file.path : '',
        chapters: normalizedChapters,
      });

      const savedCourse = await newCourse.save();
      res.status(201).json({ message: 'Course created successfully', course: savedCourse });
    } catch (err) {
      console.error('Error during course creation:', err.message);
      res.status(500).json({ message: 'Failed to create course', error: err.message });
    }
  }
);

// Route to fetch a specific course by its ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (err) {
    console.error("Error fetching course:", err.message);
    res.status(500).json({ message: "Failed to fetch course" });
  }
});

module.exports = router;

