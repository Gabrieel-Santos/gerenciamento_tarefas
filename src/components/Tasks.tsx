import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import jsPDF from "jspdf";
interface Task {
  id: number;
  titulo: string;
  descricao: string;
  concluido: boolean;
}

// Define o elemento root para a Modal
Modal.setAppElement("#root");

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchTasks = async (page: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      // Faz a requisição GET com paginação
      const response = await axios.get("http://localhost:5000/tasks", {
        params: { page },
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(response.data.tarefas);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error: unknown) {
      // Tratamento de erro para requisição
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "Erro ao listar tarefas.");
      } else {
        setError("Erro inesperado. Por favor, tente novamente.");
      }
    }
  };

  // Carrega as tarefas ao montar o componente e quando a página muda
  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  const handleTaskCompletion = async (id: number, concluido: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      // Faz a requisição PATCH para atualizar o status de conclusão da tarefa
      await axios.patch(
        `http://localhost:5000/tasks/${id}`,
        { concluido: !concluido },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza o estado das tarefas localmente
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, concluido: !concluido } : task
        )
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "Erro ao atualizar tarefa.");
      } else {
        setError("Erro inesperado. Por favor, tente novamente.");
      }
    }
  };

  // Função para navegar para a página de detalhes da tarefa, evitando que o clique em checkbox ou ícone de exclusão também navegue
  const handleTaskClick = (e: React.MouseEvent, taskId: number) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== "INPUT" && !target.closest(".delete-icon")) {
      navigate(`/tasks/${taskId}`);
    }
  };

  // Função para abrir a modal de confirmação de exclusão
  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setShowModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      // Faz a requisição DELETE para remover a tarefa
      await axios.delete(`http://localhost:5000/tasks/${taskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Atualiza a lista de tarefas removendo a tarefa deletada
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskToDelete.id)
      );
      setShowModal(false);
      setTaskToDelete(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "Erro ao excluir tarefa.");
      } else {
        setError("Erro inesperado. Por favor, tente novamente.");
      }
    }
  };

  const generatePDF = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      // Requisição para obter o perfil do usuário
      const userResponse = await axios.get("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Requisição para obter todas as tarefas sem paginação
      const allTasksResponse = await axios.get(
        "http://localhost:5000/tasks/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { nome } = userResponse.data;
      const allTasks = allTasksResponse.data.tarefas;

      // Gera o PDF usando jsPDF
      const doc = new jsPDF();

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor("#007bff");
      doc.text(nome, 10, 20);

      doc.setFontSize(14);
      doc.setFont("Helvetica", "normal");

      let yPosition = 40;

      allTasks.forEach((task: Task) => {
        doc.setTextColor("#283d50");
        doc.text(task.titulo, 10, yPosition);
        yPosition += 10;
        if (task.concluido) {
          doc.setTextColor("green");
          doc.text("Concluída", 10, yPosition);
        } else {
          doc.setTextColor("#f02849");
          doc.text("Não Concluída", 10, yPosition);
        }
        yPosition += 10;

        doc.setTextColor("#525c69");
        doc.text(doc.splitTextToSize(task.descricao, 180), 10, yPosition);
        yPosition += 20;

        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });

      doc.save("Minhas_Tarefas.pdf");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ecf5ff]">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mt-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#283d50]">Minhas Tarefas</h2>
          <button
            onClick={generatePDF}
            className="text-[#283d50] hover:text-red-700 cursor-pointer"
          >
            <FontAwesomeIcon icon={faFilePdf} size="2x" />
          </button>
        </div>

        {/* Exibe uma mensagem de erro se houver */}
        {error && (
          <p className="text-red-500 text-center mb-4 font-bold">{error}</p>
        )}

        {/* Exibe uma mensagem se não houver tarefas */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">
            Você ainda não tem tarefas. Para começar clique{" "}
            <Link
              to="/add-task"
              className="text-gray-500 hover:text-[#007bff] transition-colors"
            >
              aqui.
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={(e) => handleTaskClick(e, task.id)}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.concluido}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleTaskCompletion(task.id, task.concluido);
                    }}
                    className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-0 focus:outline-none mr-4"
                    style={{ accentColor: "green" }}
                  />
                  <div className="block max-w-[200px] text-[#283d50]">
                    <h3 className="text-lg font-semibold truncate">
                      {task.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {task.descricao}
                    </p>
                  </div>
                </div>
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(task);
                  }}
                  className="delete-icon text-[#283d50] hover:text-red-700 cursor-pointer ml-4"
                  size="lg"
                />
              </div>
            ))}
          </div>
        )}

        {/* Controle de paginação */}
        <div className="flex justify-between mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Anterior
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Próximo
          </button>
        </div>
      </div>

      {/* Modal para confirmação de exclusão */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Confirmar Exclusão"
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-bold text-[#283d50] mb-4">
          Confirmar Exclusão
        </h2>
        <p className="mb-4">
          Tem certeza de que deseja excluir a tarefa{" "}
          <strong>
            {taskToDelete &&
            taskToDelete.titulo &&
            taskToDelete.titulo.length > 20
              ? `${taskToDelete.titulo.substring(0, 20)}...`
              : taskToDelete?.titulo}
          </strong>
          ?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={confirmDeleteTask}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Excluir
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Tasks;
