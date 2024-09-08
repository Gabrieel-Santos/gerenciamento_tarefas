import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
interface UserProfile {
  nome: string;
  email: string;
  senha?: string;
}

const Profile: React.FC = () => {
  const [nome, setNome] = useState<UserProfile["nome"]>("");
  const [email, setEmail] = useState<UserProfile["email"]>("");
  const [senha, setSenha] = useState<UserProfile["senha"]>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Fetch de dados do perfil ao carregar o componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado.");
          return;
        }

        // Requisição para obter os dados do perfil
        const response = await axios.get("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { nome, email } = response.data;
        setNome(nome);
        setEmail(email);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message || "Erro ao carregar perfil.");
        } else {
          setError("Erro inesperado. Por favor, tente novamente.");
        }
      }
    };

    fetchProfile(); // Chama a função para buscar o perfil
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se as senhas coincidem
    if (senha && senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      // Requisição para atualizar os dados do perfil
      await axios.patch(
        "http://localhost:5000/profile",
        { nome, email, senha },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/tasks");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "Erro ao atualizar perfil.");
      } else {
        setError("Erro inesperado. Por favor, tente novamente.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ecf5ff]">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-[#283d50] mb-6">
          Meu Perfil
        </h2>
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4 relative">
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Nome"
              className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#007bff] hover:border-[#007bff] placeholder-[#a0aec0]"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#007bff] hover:border-[#007bff] placeholder-[#a0aec0]"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Nova Senha (opcional)"
              className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#007bff] hover:border-[#007bff] placeholder-[#a0aec0]"
            />
            <div
              className="absolute right-3 top-3 text-[#a0aec0] cursor-pointer"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} // Acessibilidade
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </div>
          </div>
          <div className="mb-4 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirmar Nova Senha"
              className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#007bff] hover:border-[#007bff] placeholder-[#a0aec0]"
            />
            <div
              className="absolute right-3 top-3 text-[#a0aec0] cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={
                showConfirmPassword
                  ? "Ocultar confirmação de senha"
                  : "Mostrar confirmação de senha"
              } // Acessibilidade
            >
              {showConfirmPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </div>
          </div>

          {/* Exibe mensagem de erro se houver */}
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

export default Profile;
