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