const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String,
  videoThumbnail: String,
});

const chapterSchema = new mongoose.Schema({
  title: String,
  topics: [topicSchema],
});

const courseSchema = new mongoose.Schema({
  title: String,
  get_points: Number,
  instructor: {
    name: String,
    avatar: String,
  },
  description: String,
  thumbnail: String,
  rating: Number,
  tags: [String],
  number_of_videos: Number,
  chapters: [chapterSchema],
});

module.exports = mongoose.model('Course', courseSchema);
