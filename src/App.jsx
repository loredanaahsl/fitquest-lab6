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

  const completedCount = activeSession.exercises.filter(
    (exercise) => exercise.completed
  ).length;

  const gainedXp = completedCount * 20 + durationMinutes * 2;

  const savedSession = {
    ...activeSession,
    finishedAt,
    durationMinutes,
    gainedXp
  };

  setHistory((currentHistory) => [savedSession, ...currentHistory]);
  setXp((currentXp) => currentXp + gainedXp);
  setActiveSession(null);
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

    </main>
  );
}