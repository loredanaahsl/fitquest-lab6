export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body",
  "Cardio"
];

export const EQUIPMENT = [
  "Bodyweight",
  "Dumbbells",
  "Barbell",
  "Machine",
  "Cable",
  "Kettlebell"
];

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export const seedExercises = [
  {
    id: crypto.randomUUID(),
    name: "Push-ups",
    muscle: "Chest",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    favorite: true,
    notes: "Keep body straight and control the movement."
  },
  {
    id: crypto.randomUUID(),
    name: "Squats",
    muscle: "Legs",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    favorite: false,
    notes: "Push knees outward and keep your chest up."
  },
  {
    id: crypto.randomUUID(),
    name: "Plank",
    muscle: "Core",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    favorite: false,
    notes: "Hold a straight line from shoulders to ankles."
  }
];