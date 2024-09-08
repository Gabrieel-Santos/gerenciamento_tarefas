import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAllTasks,
} from "../controllers/taskController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para criar uma nova tarefa com autenticação
router.post("/", authenticateToken, createTask);

// Rota para listar tarefas com paginação com requer autenticação
router.get("/", authenticateToken, getTasks);

// Rota para listar todas as tarefas do usuário autenticado para baixar o PDF
router.get("/all", authenticateToken, getAllTasks);

// Rota para obter uma tarefa específica pelo ID
router.get("/:id", authenticateToken, getTaskById);

// Rota para atualizar uma tarefa específica com requer autenticação
router.patch("/:id", authenticateToken, updateTask);

// Rota para excluir uma tarefa específica com requer autenticação
router.delete("/:id", authenticateToken, deleteTask);

export default router;
