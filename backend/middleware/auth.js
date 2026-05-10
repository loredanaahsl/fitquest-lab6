import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../routes/token.routes.js";

export function authenticate(requiredPermission) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Missing or invalid token"
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (
        requiredPermission &&
        !decoded.permissions.includes(requiredPermission)
      ) {
        return res.status(403).json({
          message: "Insufficient permissions"
        });
      }

      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({
        message: "Token expired or invalid"
      });
    }
  };
}