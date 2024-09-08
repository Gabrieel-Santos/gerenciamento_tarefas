import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface TaskInput {
  titulo: string;
  descricao: string;
}

const AddTask: React.FC = () => {
  const [titulo, setTitulo] = useState<TaskInput["titulo"]>("");
  const [descricao, setDescricao] = useState<TaskInput["descricao"]>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Função para enviar o formulário de adição de tarefa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      // Requisição para adicionar uma nova tarefa
      const response = await axios.post(
        "http://localhost:5000/tasks",
        { titulo, descricao },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        // Limpa os campos do formulário após o sucesso
        setTitulo("");
        setDescricao("");
        navigate("/tasks");
      }
    } catch (error: unknown) {
      // Verifica se o erro vem da API do Axios
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "Erro ao adicionar tarefa.");
      } else {
        setError("Erro inesperado. Por favor, tente novamente.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ecf5ff]">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-[#283d50]">
          Adicionar Tarefa
        </h2>
        <form onSubmit={handleSubmit}>
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

          {/* Exibe mensagem de erro, se houver */}
          {error && (
            <p className="text-red-500 text-center mb-4 font-bold">{error}</p>
          )}
          <button
            type="submit"
            className="w-full p-3 rounded-lg text-white transition-colors bg-[#007bff] hover:bg-[#0056b3]"
          >
            ADICIONAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
