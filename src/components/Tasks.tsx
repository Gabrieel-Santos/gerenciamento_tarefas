import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal"; // Importando o react-modal

interface Task {
  id: number;
  titulo: string;
  descricao: string;
  concluido: boolean;
}

// Configuração do modal para o React
Modal.setAppElement("#root");

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado.");
          return;
        }

        const response = await axios.get("http://localhost:5000/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message || "Erro ao listar tarefas.");
        } else {
          setError("Erro inesperado. Por favor, tente novamente.");
        }
      }
    };

    fetchTasks();
  }, []);

  const handleTaskCompletion = async (id: number, concluido: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      await axios.patch(
        `http://localhost:5000/tasks/${id}`,
        { concluido: !concluido },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

  const handleTaskClick = (e: React.MouseEvent, taskId: number) => {
    const target = e.target as HTMLElement;
    // Verifica se o checkbox ou a lixeira foram clicados para evitar conflitos
    if (target.tagName !== "INPUT" && !target.closest(".delete-icon")) {
      navigate(`/tasks/${taskId}`);
    }
  };

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

      await axios.delete(`http://localhost:5000/tasks/${taskToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ecf5ff]">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-[#283d50] mb-6">
          Minhas Tarefas
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-bold">{error}</p>
        )}

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">
            Você ainda não tem tarefas. Para começa clique{" "}
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
                      e.stopPropagation(); // Impede que o clique no checkbox redirecione
                      handleTaskCompletion(task.id, task.concluido);
                    }}
                    className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-0 focus:outline-none mr-4"
                    style={{ accentColor: "green" }}
                  />
                  <div className="block max-w-[200px] text-[#283d50]">
                    {" "}
                    {/* Ajuste de largura máxima para evitar que o título e o ícone fiquem muito próximos */}
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
                  className="delete-icon text-[#283d50] hover:text-red-700 cursor-pointer ml-4" // Cor ajustada para a mesma cor do título
                  size="lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão usando React Modal */}
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
