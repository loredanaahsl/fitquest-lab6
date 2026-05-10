import express from "express";
import cors from "cors";
import tokenRoutes from "./routes/token.routes.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/token", tokenRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "FitQuest API is running",
    docs: "http://localhost:4000/api-docs"
  });
});

app.listen(PORT, () => {
  console.log(`FitQuest API running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});