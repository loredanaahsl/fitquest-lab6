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
    </main>
  );
}