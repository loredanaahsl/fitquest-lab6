# 🏋️‍♂️ FitQuest

FitQuest is a client-side gamified workout planner built with React and Vite for Lab 6 Front-end.

The app helps users create exercises, build workout routines, start workout sessions, track completed exercises, earn XP, receive workout quality scores, view personal records, and manage workout history.

All application data is stored locally in the browser using localStorage.

## Features

- Add, edit, delete, favorite, and filter exercises
- Create workout routines from existing exercises
- Set custom sets and reps for workout exercises
- Save workouts in localStorage
- Favorite and delete saved workouts
- Start workout sessions
- Mark exercises as completed during a session
- Finish sessions and save them to history
- Earn XP based on workout quality
- Workout quality score based on completion, duration, and muscle variety
- Personal records:
  - Best XP session
  - Best quality score
  - Longest workout
  - Most completed exercises
- Session history with quality meter
- Reset XP and history
- Light and dark theme
- Fully client-side app

## User Flows

### Add an exercise

1. Fill in the exercise name.
2. Select muscle group, equipment, and difficulty.
3. Add technique notes.
4. Optionally mark it as favorite.
5. Click Add exercise.

### Filter exercises

1. Click one of the filter chips.
2. The exercise list updates immediately.
3. Favorites can also be filtered.

### Create a workout

1. Enter a workout title.
2. Add exercises from the exercise picker.
3. Set sets and reps.
4. Save the workout.

### Start a workout session

1. Go to saved workouts.
2. Click Start.
3. Check exercises as completed.
4. Click Finish workout.
5. The session is saved to history and XP is awarded.

### View progress

1. Dashboard shows XP, completed sessions, and total minutes.
2. Personal records show best workout achievements.
3. Session history shows previous workouts and quality score.

### Reset progress

1. Click Reset XP & History.
2. Confirm the action.
3. XP and session history are cleared.
4. Exercises and workouts remain saved.

## Tech Stack

- React
- Vite
- CSS custom properties
- localStorage
- GitHub Pages

## 💻 Local Development

```bash
npm install
npm run dev
```

---

## 🏗️ Build

```bash
npm run build
```

---

## 🚀 Deployment

The app is deployed using GitHub Pages.

```bash
npm run deploy
```

---

## 🌍 Live Demo

👉 https://loredanaahsl.github.io/fitquest-lab6

---

# 🔐 Lab 7 — Back-end API

FitQuest also includes a protected Express.js back-end API with JWT authorization and Swagger documentation.

The API supports CRUD operations for workout exercises and demonstrates front-end to back-end integration.

## ✅ Back-end Features

- Express.js REST API
- CRUD operations for exercises
- JWT authentication with roles and permissions
- Protected API routes using Bearer Token authorization
- Token expiration set to 1 minute
- Swagger UI API documentation
- Pagination support for large datasets
- Proper HTTP status codes
- Middleware-based authorization
- React front-end integration using Fetch API

---

## 🔑 JWT Authorization

The API includes a `/token` endpoint that generates JWT tokens with roles and permissions.

Example:

```json
{
  "role": "ADMIN"
}
```

Generated token contains:

```json
{
  "role": "ADMIN",
  "permissions": ["READ", "WRITE", "DELETE"]
}
```

---

## 📚 Swagger API Documentation

Swagger UI is available at:

```txt
http://localhost:4000/api-docs
```

Documented endpoints include:

- `POST /token`
- `GET /api/exercises`
- `POST /api/exercises`
- `GET /api/exercises/{id}`
- `PUT /api/exercises/{id}`
- `DELETE /api/exercises/{id}`

---

## 🔄 Pagination

Exercise API supports pagination:

```txt
GET /api/exercises?page=1&limit=10
```

---

## 🔗 Front-end Integration

The React application connects to the protected API using Fetch requests and JWT Bearer tokens.

Implemented demo features:

- Generate ADMIN token from React UI
- Load protected exercises from API
- Display API response directly inside the app

---

## 🛠️ Back-end Technologies

- Node.js
- Express.js
- JSON Web Token (JWT)
- Swagger UI
- Nodemon
- CORS