import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import taskRoutes from "./server/routes/taskRoutes.js";
import userRoutes from "./server/routes/userRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use("/tasks", taskRoutes);
app.use("/", userRoutes);

// Endpoint para verificar a saúde do servidor
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

export default app;
