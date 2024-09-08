import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para registrar um novo usuário
router.post("/register", registerUser);

// Rota para login do usuário e geração de token JWT
router.post("/login", loginUser);

// Rota para obter o perfil do usuário autenticado com autenticação
router.get("/profile", authenticateToken, getProfile);

// Rota para atualizar o perfil do usuário autenticado com autenticação
router.patch("/profile", authenticateToken, updateProfile);

export default router;
