import { useMemo, useState } from "react";
import {
  DIFFICULTIES,
  EQUIPMENT,
  MUSCLE_GROUPS,
  seedExercises
} from "./data/seedData";
import { useLocalStorage } from "./hooks/useLocalStorage";

const emptyExercise = {
  name: "",
  muscle: "Chest",
  equipment: "Bodyweight",
  difficulty: "Beginner",
  notes: "",
  favorite: false
};
function calculateWorkoutQuality(session, durationMinutes) {
  const completedExercises = session.exercises.filter(
    (exercise) => exercise.completed
  );

  const completedCount = completedExercises.length;
  const totalCount = session.exercises.length;

  const uniqueMuscles = new Set(
    completedExercises.map((exercise) => exercise.muscle)
  ).size;

  const completionRatio = totalCount === 0 ? 0 : completedCount / totalCount;

  const baseXp = completedCount * 20;
  const durationXp = Math.min(durationMinutes * 2, 60);
  const varietyBonus = uniqueMuscles >= 3 ? 30 : uniqueMuscles === 2 ? 15 : 0;
  const fullCompletionBonus = completionRatio === 1 ? 25 : 0;

  const qualityScore = Math.round(
    completionRatio * 60 + Math.min(uniqueMuscles * 10, 30) + Math.min(durationMinutes, 10)
  );

  const gainedXp = baseXp + durationXp + varietyBonus + fullCompletionBonus;

  let qualityLabel = "Light session";

  if (qualityScore >= 85) {
    qualityLabel = "Excellent session";
  } else if (qualityScore >= 65) {
    qualityLabel = "Strong session";
  } else if (qualityScore >= 40) {
    qualityLabel = "Solid session";
  }

  return {
    completedCount,
    totalCount,
    uniqueMuscles,
    completionRatio,
    qualityScore,
    qualityLabel,
    gainedXp
  };
}
export default function App() {
  const [theme, setTheme] = useLocalStorage("fitquest-theme", "dark");
  const [exercises, setExercises] = useLocalStorage(
    "fitquest-exercises",
    seedExercises
  );

  const [exerciseForm, setExerciseForm] = useState(emptyExercise);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [exerciseFilter, setExerciseFilter] = useState("All");

const [workouts, setWorkouts] = useLocalStorage("fitquest-workouts", []);
const [workoutTitle, setWorkoutTitle] = useState("");
const [selectedWorkoutExercises, setSelectedWorkoutExercises] = useState([]);
const [activeSession, setActiveSession] = useState(null);
const [history, setHistory] = useLocalStorage("fitquest-history", []);
const [xp, setXp] = useLocalStorage("fitquest-xp", 0);
const [apiToken, setApiToken] = useState("");
const [apiExercises, setApiExercises] = useState([]);
const [apiMessage, setApiMessage] = useState("");
const personalRecords = useMemo(() => {
  if (history.length === 0) {
    return {
      bestXp: 0,
      bestQuality: 0,
      longestWorkout: 0,
      mostExercises: 0
    };
  }

  return history.reduce(
    (records, session) => {
      const completedExercises = session.exercises.filter(
        (exercise) => exercise.completed
      ).length;

      return {
        bestXp: Math.max(records.bestXp, session.gainedXp || 0),
        bestQuality: Math.max(records.bestQuality, session.qualityScore || 0),
        longestWorkout: Math.max(
          records.longestWorkout,
          session.durationMinutes || 0
        ),
        mostExercises: Math.max(records.mostExercises, completedExercises)
      };
    },
    {
      bestXp: 0,
      bestQuality: 0,
      longestWorkout: 0,
      mostExercises: 0
    }
  );
}, [history]);
  const filteredExercises = useMemo(() => {
    if (exerciseFilter === "All") return exercises;
    if (exerciseFilter === "Favorites") {
      return exercises.filter((exercise) => exercise.favorite);
    }

    return exercises.filter((exercise) => exercise.muscle === exerciseFilter);
  }, [exercises, exerciseFilter]);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  function saveExercise(event) {
    event.preventDefault();

    const cleanExercise = {
      ...exerciseForm,
      name: exerciseForm.name.trim(),
      notes: exerciseForm.notes.trim()
    };

    if (!cleanExercise.name) return;

    if (editingExerciseId) {
      setExercises((currentExercises) =>
        currentExercises.map((exercise) =>
          exercise.id === editingExerciseId
            ? { ...exercise, ...cleanExercise }
            : exercise
        )
      );

      setEditingExerciseId(null);
    } else {
      setExercises((currentExercises) => [
        {
          id: crypto.randomUUID(),
          ...cleanExercise
        },
        ...currentExercises
      ]);
    }

    setExerciseForm(emptyExercise);
  }

  function editExercise(exercise) {
    setEditingExerciseId(exercise.id);
    setExerciseForm({
      name: exercise.name,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
      notes: exercise.notes,
      favorite: exercise.favorite
    });
  }

  function deleteExercise(id) {
    setExercises((currentExercises) =>
      currentExercises.filter((exercise) => exercise.id !== id)
    );
  }
async function getAdminTokenFromApi() {
  try {
    const response = await fetch("http://localhost:4000/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: "ADMIN" })
    });

    const data = await response.json();

    if (!response.ok) {
      setApiMessage(data.message || "Could not get token");
      return;
    }

    setApiToken(data.token);
    setApiMessage("Admin token received. It expires in 1 minute.");
  } catch {
    setApiMessage("Backend server is not running.");
  }
}

async function loadExercisesFromApi() {
  if (!apiToken) {
    setApiMessage("Get a token first.");
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/api/exercises?page=1&limit=10", {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      setApiMessage(data.message || "Could not load exercises");
      return;
    }

    setApiExercises(data.data);
    setApiMessage(`Loaded ${data.data.length} exercises from backend API.`);
  } catch {
    setApiMessage("Could not connect to backend API.");
  }
}
  function toggleExerciseFavorite(id) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, favorite: !exercise.favorite }
          : exercise
      )
    );
  }
function addExerciseToWorkout(exercise) {
  setSelectedWorkoutExercises((currentExercises) => [
    ...currentExercises,
    {
      id: crypto.randomUUID(),
      name: exercise.name,
      muscle: exercise.muscle,
      sets: 3,
      reps: 10
    }
  ]);
}

function updateWorkoutExercise(id, field, value) {
  setSelectedWorkoutExercises((currentExercises) =>
    currentExercises.map((exercise) =>
      exercise.id === id ? { ...exercise, [field]: value } : exercise
    )
  );
}

function removeWorkoutExercise(id) {
  setSelectedWorkoutExercises((currentExercises) =>
    currentExercises.filter((exercise) => exercise.id !== id)
  );
}

function saveWorkout(event) {
  event.preventDefault();

  const cleanTitle = workoutTitle.trim();

  if (!cleanTitle || selectedWorkoutExercises.length === 0) return;

  setWorkouts((currentWorkouts) => [
    {
      id: crypto.randomUUID(),
      title: cleanTitle,
      favorite: false,
      exercises: selectedWorkoutExercises
    },
    ...currentWorkouts
  ]);

  setWorkoutTitle("");
  setSelectedWorkoutExercises([]);
}
function startWorkout(workout) {
  setActiveSession({
    id: crypto.randomUUID(),
    workoutTitle: workout.title,
    startedAt: new Date().toISOString(),
    exercises: workout.exercises.map((exercise) => ({
      ...exercise,
      completed: false
    }))
  });
}
function toggleSessionExercise(id) {
  setActiveSession((current) => ({
    ...current,
    exercises: current.exercises.map((exercise) =>
      exercise.id === id
        ? { ...exercise, completed: !exercise.completed }
        : exercise
    )
  }));
}
function finishSession() {
  if (!activeSession) return;

  const finishedAt = new Date().toISOString();
  const started = new Date(activeSession.startedAt);
  const finished = new Date(finishedAt);
  const durationMinutes = Math.max(1, Math.round((finished - started) / 60000));
const quality = calculateWorkoutQuality(activeSession, durationMinutes);
const gainedXp = quality.gainedXp;
 
 const savedSession = {
  ...activeSession,
  finishedAt,
  durationMinutes,
  gainedXp,
  qualityScore: quality.qualityScore,
  qualityLabel: quality.qualityLabel,
  uniqueMuscles: quality.uniqueMuscles
};

  setHistory((currentHistory) => [savedSession, ...currentHistory]);
  setXp((currentXp) => currentXp + gainedXp);
  setActiveSession(null);
}
function resetProgress() {
  const confirmed = window.confirm(
    "Reset all XP and session history? Exercises and workouts will stay saved."
  );

  if (!confirmed) return;

  setXp(0);
  setHistory([]);
}
  return (
    <main className="app" data-theme={theme}>
      <header className="hero">
        <div>
          <p className="eyebrow">Lab 6 Front-end Project</p>
          <h1>FitQuest</h1>
          <p className="subtitle">
            A gamified workout planner where students build exercises, save
            routines, and track fitness progress.
          </p>
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>
      <section className="stats-grid">
  <article className="card stat-card">
    <p>Total XP</p>
    <strong>{xp}</strong>
  </article>

  <article className="card stat-card">
    <p>Completed sessions</p>
    <strong>{history.length}</strong>
  </article>

  <article className="card stat-card">
    <p>Total minutes</p>
    <strong>
      {history.reduce((total, session) => total + session.durationMinutes, 0)}
    </strong>
  </article>
</section>
<div className="dashboard-actions">
  <button className="danger" onClick={resetProgress}>
    Reset XP & History
  </button>
</div>
{/* ✅ ADD PERSONAL RECORDS HERE */}
<section className="section-gap">
  <div className="section-title">
    <div>
      <p className="eyebrow">Personal records</p>
      <h2>Training highlights</h2>
    </div>
  </div>

  <div className="records-grid">
    <article className="card record-card">
      <p>Best XP session</p>
      <strong>{personalRecords.bestXp} XP</strong>
    </article>

    <article className="card record-card">
      <p>Best quality score</p>
      <strong>{personalRecords.bestQuality}/100</strong>
    </article>

    <article className="card record-card">
      <p>Longest workout</p>
      <strong>{personalRecords.longestWorkout} min</strong>
    </article>

    <article className="card record-card">
      <p>Most completed exercises</p>
      <strong>{personalRecords.mostExercises}</strong>
    </article>
  </div>
</section>

<section className="section-gap">
  <div className="section-title">
    <div>
      <p className="eyebrow">Backend integration</p>
      <h2>API Demo</h2>
    </div>
  </div>

  <article className="card api-demo-card">
    <p className="muted">
      This panel connects the React front-end with the protected Express API.
    </p>

    <div className="actions">
      <button className="primary" onClick={getAdminTokenFromApi}>
        Get ADMIN Token
      </button>

      <button onClick={loadExercisesFromApi}>
        Load API Exercises
      </button>
    </div>

    {apiMessage && <p className="muted api-message">{apiMessage}</p>}

    {apiExercises.length > 0 && (
      <div className="api-exercise-list">
        {apiExercises.map((exercise) => (
          <div key={exercise.id} className="api-exercise-item">
            <strong>{exercise.name}</strong>
            <span>
              {exercise.muscle} · {exercise.equipment} ·{" "}
              {exercise.difficulty}
            </span>
          </div>
        ))}
      </div>
    )}
  </article>
</section>

{activeSession && (
  <section className="card section-gap">
    <h2>{activeSession.workoutTitle}</h2>

    <p className="muted">
      Started at {new Date(activeSession.startedAt).toLocaleTimeString()}
    </p>

    <div className="session-list">
      {activeSession.exercises.map((exercise) => (
        <label className="session-exercise" key={exercise.id}>
          <input
            type="checkbox"
            checked={exercise.completed}
            onChange={() => toggleSessionExercise(exercise.id)}
          />

          <span>
            {exercise.name} — {exercise.sets} × {exercise.reps}
          </span>
        </label>
      ))}
    </div>

    <button className="primary" onClick={finishSession}>
      Finish workout
    </button>
  </section>
)}

      <section className="two-column">
        <form className="card form" onSubmit={saveExercise}>
          <h2>{editingExerciseId ? "Edit exercise" : "Add exercise"}</h2>

          <label>
            Exercise name
            <input
              value={exerciseForm.name}
              onChange={(event) =>
                setExerciseForm({
                  ...exerciseForm,
                  name: event.target.value
                })
              }
              placeholder="Example: Bench Press"
            />
          </label>

          <label>
            Muscle group
            <select
              value={exerciseForm.muscle}
              onChange={(event) =>
                setExerciseForm({
                  ...exerciseForm,
                  muscle: event.target.value
                })
              }
            >
              {MUSCLE_GROUPS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Equipment
            <select
              value={exerciseForm.equipment}
              onChange={(event) =>
                setExerciseForm({
                  ...exerciseForm,
                  equipment: event.target.value
                })
              }
            >
              {EQUIPMENT.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Difficulty
            <select
              value={exerciseForm.difficulty}
              onChange={(event) =>
                setExerciseForm({
                  ...exerciseForm,
                  difficulty: event.target.value
                })
              }
            >
              {DIFFICULTIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Technique notes
            <textarea
              value={exerciseForm.notes}
              onChange={(event) =>
                setExerciseForm({
                  ...exerciseForm,
                  notes: event.target.value
                })
              }
              placeholder="Short tip or technique reminder"
            />
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={exerciseForm.favorite}
              onChange={(event) =>
                setExerciseForm({
                  ...exerciseForm,
                  favorite: event.target.checked
                })
              }
            />
            Mark as favorite
          </label>

          <button className="primary">
            {editingExerciseId ? "Save changes" : "Add exercise"}
          </button>
        </form>

        <section>
          <div className="filters">
            {["All", "Favorites", ...MUSCLE_GROUPS].map((filter) => (
              <button
                key={filter}
                className={
                  exerciseFilter === filter ? "chip active-chip" : "chip"
                }
                onClick={() => setExerciseFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="card-list">
            {filteredExercises.map((exercise) => (
              <article className="card item-card" key={exercise.id}>
                <div>
                  <h3>
                    {exercise.favorite ? "⭐ " : ""}
                    {exercise.name}
                  </h3>
                  <p>
                    {exercise.muscle} · {exercise.equipment} ·{" "}
                    {exercise.difficulty}
                  </p>
                  <small>{exercise.notes}</small>
                </div>

                <div className="actions">
                 
                  <button onClick={() => toggleExerciseFavorite(exercise.id)}>
                    Favorite
                  </button>
                  <button onClick={() => editExercise(exercise)}>Edit</button>
                  <button
                    className="danger"
                    onClick={() => deleteExercise(exercise.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
               </section>
      </section>

      <section className="two-column section-gap">
        <form className="card form" onSubmit={saveWorkout}>
          <h2>Create workout</h2>

          <label>
            Workout title
            <input
              value={workoutTitle}
              onChange={(event) => setWorkoutTitle(event.target.value)}
              placeholder="Example: Push Day"
            />
          </label>

          <div className="builder-list">
            {selectedWorkoutExercises.length === 0 ? (
              <p className="muted">Add exercises from the list on the right.</p>
            ) : (
              selectedWorkoutExercises.map((exercise) => (
                <div className="builder-row" key={exercise.id}>
                  <strong>{exercise.name}</strong>

                  <input
                    type="number"
                    min="1"
                    value={exercise.sets}
                    onChange={(event) =>
                      updateWorkoutExercise(
                        exercise.id,
                        "sets",
                        Number(event.target.value)
                      )
                    }
                  />

                  <span>sets</span>

                  <input
                    type="number"
                    min="1"
                    value={exercise.reps}
                    onChange={(event) =>
                      updateWorkoutExercise(
                        exercise.id,
                        "reps",
                        Number(event.target.value)
                      )
                    }
                  />

                  <span>reps/sec</span>

                  <button
                    type="button"
                    className="danger"
                    onClick={() => removeWorkoutExercise(exercise.id)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <button className="primary">Save workout</button>
        </form>

        <section>
          <h2>Exercise picker</h2>

          <div className="card-list">
            {exercises.map((exercise) => (
              <article className="card item-card" key={exercise.id}>
                <div>
                  <h3>{exercise.name}</h3>
                  <p>
                    {exercise.muscle} · {exercise.equipment} ·{" "}
                    {exercise.difficulty}
                  </p>
                </div>

                <button onClick={() => addExerciseToWorkout(exercise)}>
                  Add to workout
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="section-gap">

        <div className="section-title">
          <div>
            <p className="eyebrow">Saved routines</p>
            <h2>Your workouts</h2>
          </div>
          <p className="muted">{workouts.length} workout(s) saved</p>
        </div>

        <div className="card-list">
          {workouts.length === 0 ? (
            <article className="card">
              <p className="muted">
                No workouts saved yet. Create your first routine above.
              </p>
            </article>
          ) : (
            workouts.map((workout) => (
              <article className="card workout-card" key={workout.id}>
                <div className="card-header">
                  <div>
                    <h3>
                      {workout.favorite ? "⭐ " : ""}
                      {workout.title}
                    </h3>
                    <p>{workout.exercises.length} exercise(s)</p>
                  </div>
<div className="actions">
  <button className="primary" onClick={() => startWorkout(workout)}>
    Start
  </button>

  <button
    onClick={() =>
      setWorkouts((current) =>
        current.map((item) =>
          item.id === workout.id
            ? { ...item, favorite: !item.favorite }
            : item
        )
      )
    }
  >
    Favorite
  </button>

  <button
    className="danger"
    onClick={() =>
      setWorkouts((current) =>
        current.filter((item) => item.id !== workout.id)
      )
    }
  >
    Delete
  </button>
</div>
                  
                </div>

                <ul>
                  {workout.exercises.map((exercise) => (
                    <li key={exercise.id}>
                      {exercise.name} — {exercise.sets} × {exercise.reps}
                    </li>
                  ))}
                </ul>
              </article>
            ))
          )}
        </div>
      </section>
<section className="section-gap">
  <div className="section-title">
    <div>
      <p className="eyebrow">Progress log</p>
      <h2>Session history</h2>
    </div>

    <p className="muted">{history.length} completed session(s)</p>
  </div>

  <div className="card-list">
    {history.length === 0 ? (
      <article className="card">
        <p className="muted">No completed sessions yet.</p>
      </article>
    ) : (
      history.map((session) => (
        <article className="card workout-card" key={session.id}>
          <div className="card-header">
            <div>
              <h3>{session.workoutTitle}</h3>
             <p>
  {new Date(session.finishedAt).toLocaleDateString()} ·{" "}
  {session.durationMinutes} min · +{session.gainedXp} XP
</p>

<p className="muted">
  Quality: {session.qualityLabel || "Session completed"} · Score:{" "}
  {session.qualityScore || 0}/100 · Muscles:{" "}
  {session.uniqueMuscles || 0}
</p>
<div className="quality-meter">
  <span style={{ width: `${session.qualityScore || 0}%` }} />
</div>
            </div>

            <button
              className="danger"
              onClick={() =>
                setHistory((currentHistory) =>
                  currentHistory.filter((item) => item.id !== session.id)
                )
              }
            >
              Delete
            </button>
          </div>

          <ul>
            {session.exercises.map((exercise) => (
              <li
                key={exercise.id}
                className={exercise.completed ? "completed" : ""}
              >
                {exercise.completed ? "✅" : "⬜"} {exercise.name} —{" "}
                {exercise.sets} × {exercise.reps}
              </li>
            ))}
          </ul>
        </article>
      ))
    )}
  </div>
</section>
    </main>
  );
}