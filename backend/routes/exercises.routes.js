import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

let exercises = [
  {
    id: 1,
    name: "Push-ups",
    muscle: "Chest",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    notes: "Keep body straight."
  },
  {
    id: 2,
    name: "Squats",
    muscle: "Legs",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    notes: "Keep chest up."
  }
];

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Get exercises with pagination
 *     tags:
 *       - Exercises
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Exercises returned successfully
 *       401:
 *         description: Missing or invalid token
 */
router.get("/", authenticate("READ"), (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const data = exercises.slice(skip, skip + limit);

  res.status(200).json({
    page,
    limit,
    total: exercises.length,
    data
  });
});

/**
 * @swagger
 * /api/exercises/{id}:
 *   get:
 *     summary: Get exercise by id
 *     tags:
 *       - Exercises
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exercise found
 *       404:
 *         description: Exercise not found
 */
router.get("/:id", authenticate("READ"), (req, res) => {
  const id = Number(req.params.id);
  const exercise = exercises.find((item) => item.id === id);

  if (!exercise) {
    return res.status(404).json({
      message: "Exercise not found"
    });
  }

  return res.status(200).json(exercise);
});

/**
 * @swagger
 * /api/exercises:
 *   post:
 *     summary: Create exercise
 *     tags:
 *       - Exercises
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Exercise created
 *       400:
 *         description: Invalid request body
 */
router.post("/", authenticate("WRITE"), (req, res) => {
  const { name, muscle, equipment, difficulty, notes } = req.body;

  if (!name || !muscle) {
    return res.status(400).json({
      message: "Name and muscle are required"
    });
  }

  const exercise = {
    id: Date.now(),
    name,
    muscle,
    equipment: equipment || "Bodyweight",
    difficulty: difficulty || "Beginner",
    notes: notes || ""
  };

  exercises.push(exercise);

  return res.status(201).json(exercise);
});

/**
 * @swagger
 * /api/exercises/{id}:
 *   put:
 *     summary: Update exercise
 *     tags:
 *       - Exercises
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exercise updated
 *       404:
 *         description: Exercise not found
 */
router.put("/:id", authenticate("WRITE"), (req, res) => {
  const id = Number(req.params.id);
  const index = exercises.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Exercise not found"
    });
  }

  exercises[index] = {
    ...exercises[index],
    ...req.body,
    id
  };

  return res.status(200).json(exercises[index]);
});

/**
 * @swagger
 * /api/exercises/{id}:
 *   delete:
 *     summary: Delete exercise
 *     tags:
 *       - Exercises
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exercise deleted
 *       404:
 *         description: Exercise not found
 */
router.delete("/:id", authenticate("DELETE"), (req, res) => {
  const id = Number(req.params.id);
  const exists = exercises.some((item) => item.id === id);

  if (!exists) {
    return res.status(404).json({
      message: "Exercise not found"
    });
  }

  exercises = exercises.filter((item) => item.id !== id);

  return res.status(200).json({
    message: "Exercise deleted"
  });
});

export default router;