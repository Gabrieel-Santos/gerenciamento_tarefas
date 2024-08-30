import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(bodyParser.json());

// Middleware para autenticar o usuário usando JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Endpoint para verificar a saúde do servidor
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Endpoint para registro de usuário
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  // Verificar se o usuário já existe pelo email
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    return res.status(409).json({ message: "Email já cadastrado" });
  }

  // Criptografar a senha
  const hashedPassword = await bcrypt.hash(senha, 10);

  try {
    // Criar o novo usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
      },
    });
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
});

// Endpoint para login de usuário
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verificar se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    // Gerar token JWT
    const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});

// Endpoint para adicionar uma nova tarefa
app.post("/tasks", authenticateToken, async (req, res) => {
  const { titulo, descricao } = req.body;

  try {
    const novaTarefa = await prisma.tarefa.create({
      data: {
        titulo,
        descricao,
        usuarioId: req.user.id, // Associa a tarefa ao usuário autenticado
      },
    });
    res.status(201).json(novaTarefa);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ message: "Erro ao criar tarefa" });
  }
});

// Endpoint para listar as tarefas do usuário autenticado
app.get("/tasks", authenticateToken, async (req, res) => {
  try {
    const tarefas = await prisma.tarefa.findMany({
      where: { usuarioId: req.user.id },
    });
    res.json(tarefas);
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({ message: "Erro ao listar tarefas" });
  }
});

// Endpoint para atualizar uma tarefa específica
app.patch("/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, concluido } = req.body;

  try {
    const tarefaAtualizada = await prisma.tarefa.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        descricao,
        concluido: concluido !== undefined ? concluido : undefined,
      },
    });

    res.json(tarefaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ message: "Erro ao atualizar tarefa" });
  }
});

// Endpoint para obter os detalhes de uma tarefa específica
app.get("/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const tarefa = await prisma.tarefa.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tarefa || tarefa.usuarioId !== req.user.id) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    res.json(tarefa);
  } catch (error) {
    console.error("Erro ao obter tarefa:", error);
    res.status(500).json({ message: "Erro ao obter tarefa" });
  }
});

// Endpoint para excluir uma tarefa específica
app.delete("/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se a tarefa existe e pertence ao usuário autenticado
    const tarefa = await prisma.tarefa.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tarefa || tarefa.usuarioId !== req.user.id) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    // Excluir a tarefa
    await prisma.tarefa.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send(); // Retornar 204 No Content, pois a exclusão foi bem-sucedida e não há conteúdo a retornar
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ message: "Erro ao excluir tarefa" });
  }
});

// Endpoint para obter as informações do perfil do usuário autenticado
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Erro ao obter perfil do usuário:", error);
    res.status(500).json({ message: "Erro ao obter perfil do usuário" });
  }
});

// Endpoint para atualizar o perfil do usuário autenticado
app.patch("/profile", authenticateToken, async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const updateData = { nome, email };

    if (senha) {
      // Criptografar a nova senha, se fornecida
      const hashedPassword = await bcrypt.hash(senha, 10);
      updateData.senha = hashedPassword;
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: req.user.id },
      data: updateData,
    });

    res.json(usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar perfil do usuário" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
