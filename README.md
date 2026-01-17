# LMS Backend API

A simple Learning Management System Backend API built with Node.js and Express.js.

## Quick Start

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3000`

## Authentication

All `/courses` endpoints require the `x-api-key` header:

```
x-api-key: your_api_key
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check (no auth) |
| `/courses` | POST | Create a new course |
| `/courses/:id` | GET | Get course details |
| `/courses/:id/progress` | POST | Update user progress |
| `/courses/:id/progress/:userId` | GET | Get user progress report |

## Example Requests

### Create Course
```bash
POST /courses
Content-Type: application/json
x-api-key: your_api_key

{
  "id": "course2",
  "title": "Node.js Fundamentals",
  "lessons": [
    {
      "lessonId": "l1",
      "title": "Introduction",
      "quiz": [
        {
          "question": "What is Node.js?",
          "options": ["A browser", "A runtime", "A database", "A language"],
          "correctAnswer": 1
        }
      ]
    }
  ]
}
```

### Update Progress
```bash
POST /courses/course1/progress
Content-Type: application/json
x-api-key: your_api_key

{
  "userId": "user123",
  "lessonId": "l1",
  "quizAnswers": [1, 0]
}
```

## Error Codes

| Status | Description |
|--------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid API key |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Project Structure

```
backend/
 ├── server.js           # Main Express server
 ├── routes/
 │    └── courses.js     # Course API routes
 ├── middleware/
 │    └── auth.js        # API key authentication
 ├── data/
 │    └── courses.json   # Data storage
 └── utils/
      └── validate.js    # Input validation
```
