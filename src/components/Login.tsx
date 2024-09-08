import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Faz uma requisição POST para o endpoint de login
      const response = await axios.post("http://localhost:5000/login", {
        email,
        senha,
      });

      const { token } = response.data;

      // Armazena o token no localStorage
      localStorage.setItem("token", token);
      navigate("/tasks");
    } catch (error: unknown) {
      // Verifica se o erro é do Axios e exibe a mensagem apropriada
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "Erro ao fazer login.");
      } else {
        setError("Erro inesperado. Por favor, tente novamente.");
      }
    }
  };

  // Alterna a visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#ecf5ff]">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <img src="./logo.png" alt="Logo" className="mx-auto h-12 w-auto" />
        </div>
        <form onSubmit={handleSubmit}>
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
              required
              placeholder="Senha"
              className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#007bff] hover:border-[#007bff] placeholder-[#a0aec0]"
            />
            <div
              className="absolute right-3 top-3 text-[#a0aec0] cursor-pointer"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} // Acessibilidade
            >
              {/* Alterna entre o ícone de olho aberto e fechado */}
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </div>
          </div>

          {/* Exibe uma mensagem de erro se houver */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 rounded-lg text-white transition-colors bg-[#007bff] hover:bg-[#0056b3]"
          >
            ENTRAR
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-[#a0aec0]">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="text-[#a0aec0] hover:text-[#007bff] transition-colors"
            >
              Registrar-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
