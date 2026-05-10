import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const JWT_SECRET = "fitquest_lab7_secret";

const rolePermissions = {
  ADMIN: ["READ", "WRITE", "DELETE"],
  WRITER: ["READ", "WRITE"],
  VISITOR: ["READ"]
};

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Generate JWT token
 *     description: Returns a JWT containing role and permissions. Token expires in 1 minute.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: JWT generated successfully
 *       400:
 *         description: Invalid role
 */
router.post("/", (req, res) => {
  const { role } = req.body;

  if (!role || !rolePermissions[role]) {
    return res.status(400).json({
      message: "Invalid role. Use ADMIN, WRITER, or VISITOR."
    });
  }

  const token = jwt.sign(
    {
      role,
      permissions: rolePermissions[role]
    },
    JWT_SECRET,
    {
      expiresIn: "1m"
    }
  );

  return res.status(200).json({
    token,
    expiresIn: "1 minute",
    role,
    permissions: rolePermissions[role]
  });
});

export { JWT_SECRET };
export default router;