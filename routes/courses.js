const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { validateCourse, validateProgressUpdate } = require("../utils/validate");

const DATA_FILE = path.join(__dirname, "../data/courses.json");

function loadCourses() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data).courses;
  } catch (err) {
    return [];
  }
}

function saveCourses(courses) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ courses }, null, 2));
}

let courses = loadCourses();

// Create course
router.post("/", (req, res) => {
  try {
    const validation = validateCourse(req.body);
    if (!validation.valid) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: validation.errors });
    }

    if (courses.find((c) => c.id === req.body.id)) {
      return res.status(400).json({ error: "Course already exists" });
    }

    const newCourse = {
      id: req.body.id,
      title: req.body.title,
      lessons: req.body.lessons,
      progress: {},
    };

    courses.push(newCourse);
    saveCourses(courses);

    res.status(201).json({ message: "Course created", course: newCourse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get course
router.get("/:id", (req, res) => {
  try {
    const course = courses.find((c) => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add lesson to course
router.post("/:id/lessons", (req, res) => {
  try {
    const course = courses.find((c) => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const { lessonId, title, quiz } = req.body;

    if (!lessonId || typeof lessonId !== "string") {
      return res.status(400).json({ error: "lessonId required" });
    }

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "title required" });
    }

    if (course.lessons.find((l) => l.lessonId === lessonId)) {
      return res.status(400).json({ error: "Lesson already exists" });
    }

    const newLesson = { lessonId, title, quiz: quiz || [] };
    course.lessons.push(newLesson);
    saveCourses(courses);

    res.status(201).json({ message: "Lesson added", lesson: newLesson });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update progress
router.post("/:id/progress", (req, res) => {
  try {
    const validation = validateProgressUpdate(req.body);
    if (!validation.valid) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: validation.errors });
    }

    const { userId, lessonId, quizAnswers } = req.body;

    const course = courses.find((c) => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const lesson = course.lessons.find((l) => l.lessonId === lessonId);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    if (!course.progress[userId]) {
      course.progress[userId] = { completedLessons: [], score: 0 };
    }

    const userProgress = course.progress[userId];

    // Calculate quiz score
    let quizScore = 0;
    if (quizAnswers && lesson.quiz) {
      lesson.quiz.forEach((q, i) => {
        if (quizAnswers[i] === q.correctAnswer) quizScore++;
      });
    }

    if (!userProgress.completedLessons.includes(lessonId)) {
      userProgress.completedLessons.push(lessonId);
    }
    userProgress.score += quizScore;

    saveCourses(courses);

    res.json({
      message: "Progress updated",
      quizScore,
      totalQuestions: lesson.quiz ? lesson.quiz.length : 0,
      progress: userProgress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user progress
router.get("/:id/progress/:userId", (req, res) => {
  try {
    const { id, userId } = req.params;

    const course = courses.find((c) => c.id === id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const userProgress = course.progress[userId];
    if (!userProgress) {
      return res.status(404).json({ error: "No progress found for this user" });
    }

    const totalLessons = course.lessons.length;
    const completed = userProgress.completedLessons.length;
    const percentage = Math.round((completed / totalLessons) * 100);

    res.json({
      userId,
      courseId: id,
      courseTitle: course.title,
      totalLessons,
      completedLessons: completed,
      progressPercentage: percentage,
      totalScore: userProgress.score,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
