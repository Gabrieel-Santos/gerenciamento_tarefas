import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Criação de uma nova tarefa
export const createTask = async (req, res) => {
  const { titulo, descricao } = req.body;

  // Verifica se o título e a descrição estão presentes
  if (!titulo || !descricao) {
    return res
      .status(400)
      .json({ message: "Título e descrição são obrigatórios" });
  }

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
};

// Listagem de tarefas paginadas
export const getTasks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 5;

  try {
    // Conta o número total de tarefas do usuário
    const totalTarefas = await prisma.tarefa.count({
      where: { usuarioId: req.user.id },
    });

    // Busca as tarefas com paginação
    const tarefas = await prisma.tarefa.findMany({
      where: { usuarioId: req.user.id },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalTarefas / pageSize);
    res.json({ tarefas, currentPage: page, totalPages });
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({ message: "Erro ao listar tarefas" });
  }
};

// Listagem de todas as tarefas para baixar o PDF
export const getAllTasks = async (req, res) => {
  try {
    const tarefas = await prisma.tarefa.findMany({
      where: { usuarioId: req.user.id },
    });
    res.json({ tarefas });
  } catch (error) {
    console.error("Erro ao listar todas as tarefas:", error);
    res.status(500).json({ message: "Erro ao listar todas as tarefas" });
  }
};

// Busca tarefa específica por ID
export const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const tarefa = await prisma.tarefa.findUnique({
      where: { id: parseInt(id) },
    });

    // Verifica se a tarefa existe e se pertence ao usuário autenticado
    if (!tarefa || tarefa.usuarioId !== req.user.id) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    res.json(tarefa);
  } catch (error) {
    console.error("Erro ao obter tarefa:", error);
    res.status(500).json({ message: "Erro ao obter tarefa" });
  }
};

// Atualização de uma tarefa
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, concluido } = req.body;

  try {
    // Atualiza somente os campos fornecidos na requisição
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
};

// Exclusão de uma tarefa
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const tarefa = await prisma.tarefa.findUnique({
      where: { id: parseInt(id) },
    });

    // Verifica se a tarefa existe e pertence ao usuário
    if (!tarefa || tarefa.usuarioId !== req.user.id) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    await prisma.tarefa.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send(); // Tarefa excluída com sucesso, sem conteúdo retornado
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ message: "Erro ao excluir tarefa" });
  }
};
