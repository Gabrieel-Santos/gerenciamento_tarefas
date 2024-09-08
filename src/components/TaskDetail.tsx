import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Task {
  id: number;
  titulo: string;
  descricao: string;
  concluido: boolean;
}

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado.");
          return;
        }

        // Requisição para obter os dados da tarefa pelo ID
        const response = await axios.get(`http://localhost:5000/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const taskData = response.data;
        setTask(taskData);
        setTitulo(taskData.titulo);
        setDescricao(taskData.descricao);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message || "Erro ao carregar tarefa.");
        } else {
          setError("Erro inesperado. Por favor, tente novamente.");
        }
      }
    };

    fetchTask(); // Chama a função ao montar o componente
  }, [id]);

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      // Requisição para atualizar a tarefa
      await axios.patch(
        `http://localhost:5000/tasks/${id}`,
        { titulo, descricao },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/tasks");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "Erro ao atualizar tarefa.");
      } else {
        setError("Erro inesperado. Por favor, tente novamente.");
      }
    }
  };

  // Exibe uma mensagem de erro, se houver
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // Exibe uma mensagem de carregamento enquanto a tarefa é obtida
  if (!task) {
    return <p className="text-center">Carregando...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ecf5ff]">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-[#283d50] mb-6">
          Detalhes da Tarefa
        </h2>
        <form onSubmit={handleUpdateTask}>
          <div className="mb-4 relative">
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              placeholder="Título"
              className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#007bff] hover:border-[#007bff] placeholder-[#a0aec0]"
            />
          </div>
          <div className="mb-4 relative">
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              placeholder="Descrição"
              className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#007bff] hover:border-[#007bff] placeholder-[#a0aec0]"
            />
          </div>
          {error && (
            <p className="text-red-500 text-center mb-4 font-bold">{error}</p>
          )}
          <button
            type="submit"
            className="w-full p-3 rounded-lg text-white transition-colors bg-[#007bff] hover:bg-[#0056b3]"
          >
            ATUALIZAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskDetail;
