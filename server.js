const express = require("express");
const coursesRouter = require("./routes/courses");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/courses", authMiddleware, coursesRouter);

app.get("/", (req, res) => {
  res.json({
    message: "LMS Backend API",
    version: "1.0.0",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
