function validateCourse(body) {
  const errors = [];

  if (!body.id || typeof body.id !== "string") {
    errors.push("Course ID required");
  }

  if (!body.title || typeof body.title !== "string") {
    errors.push("Title required");
  }

  if (!body.lessons || !Array.isArray(body.lessons)) {
    errors.push("Lessons array required");
  } else {
    body.lessons.forEach((lesson, i) => {
      if (!lesson.lessonId) errors.push(`Lesson ${i}: lessonId required`);
      if (!lesson.title) errors.push(`Lesson ${i}: title required`);
    });
  }

  return { valid: errors.length === 0, errors };
}

function validateProgressUpdate(body) {
  const errors = [];

  if (!body.userId || typeof body.userId !== "string") {
    errors.push("userId required");
  }

  if (!body.lessonId || typeof body.lessonId !== "string") {
    errors.push("lessonId required");
  }

  if (body.quizAnswers && !Array.isArray(body.quizAnswers)) {
    errors.push("quizAnswers must be array");
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateCourse, validateProgressUpdate };
