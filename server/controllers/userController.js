import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY; // Chave secreta para geração do token JWT

// Registro de um novo usuário
export const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifica se o email já está cadastrado
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });
  if (usuarioExistente)
    return res.status(409).json({ message: "Email já cadastrado" });

  try {
    // Cria um hash da senha para armazená-la de forma segura
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria um novo usuário no banco de dados
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: hashedPassword },
    });

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
};

// Login do usuário com autenticação JWT
export const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca o usuário pelo email
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    // Verifica se o usuário existe e se a senha está correta
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ message: "Email ou senha incorretos" });
    }

    // Gera um token JWT com a chave secreta e duração de 1 hora
    const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ message: "Erro ao realizar login" });
  }
};

// Retorna o perfil do usuário autenticado
export const getProfile = async (req, res) => {
  try {
    // Busca o usuário pelo ID obtido do token JWT (req.user.id)
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
    });

    // Verifica se o usuário foi encontrado
    if (!usuario)
      return res.status(404).json({ message: "Usuário não encontrado" });

    res.json(usuario); // Retorna os dados do usuário
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    res.status(500).json({ message: "Erro ao obter perfil" });
  }
};

// Atualiza o perfil do usuário autenticado
export const updateProfile = async (req, res) => {
  const { nome, email, senha } = req.body;

  // Cria o objeto de dados a serem atualizados
  const updateData = { nome, email };

  // Se o usuário quiser alterar a senha, criptografa a nova senha
  if (senha) {
    updateData.senha = await bcrypt.hash(senha, 10);
  }

  try {
    // Atualiza o perfil do usuário autenticado no banco de dados
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: req.user.id },
      data: updateData,
    });

    res.json(usuarioAtualizado); // Retorna os dados atualizados
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ message: "Erro ao atualizar perfil" });
  }
};
