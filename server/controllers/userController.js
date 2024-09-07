import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

export const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });
  if (usuarioExistente)
    return res.status(409).json({ message: "Email já cadastrado" });

  const hashedPassword = await bcrypt.hash(senha, 10);
  try {
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: hashedPassword },
    });
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
};

export const loginUser = async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    return res.status(401).json({ message: "Email ou senha incorretos" });
  }
  const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
};

export const getProfile = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
    });
    if (!usuario)
      return res.status(404).json({ message: "Usuário não encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter perfil" });
  }
};

export const updateProfile = async (req, res) => {
  const { nome, email, senha } = req.body;
  const updateData = { nome, email };
  if (senha) updateData.senha = await bcrypt.hash(senha, 10);

  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: req.user.id },
      data: updateData,
    });
    res.json(usuarioAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar perfil" });
  }
};
