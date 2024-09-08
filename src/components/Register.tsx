import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface RegisterInput {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

const Register: React.FC = () => {
  const [nome, setNome] = useState<RegisterInput["nome"]>("");
  const [email, setEmail] = useState<RegisterInput["email"]>("");
  const [senha, setSenha] = useState<RegisterInput["senha"]>("");
  const [confirmarSenha, setConfirmarSenha] =
    useState<RegisterInput["confirmarSenha"]>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      // Faz a requisição para o endpoint de registro
      const response = await axios.post("http://localhost:5000/register", {
        nome,
        email,
        senha,
      });

      if (response.status === 201) {
        navigate("/");
      }
    } catch (error: unknown) {
      // Verifica se o erro é do Axios e exibe a mensagem apropriada
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setError("Email já cadastrado.");
        } else {
          setError(
            error.response?.data.message || "Erro ao registrar usuário."
          );
        }
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
        <form onSubmit={handleSubmit}>
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
              required
              placeholder="Senha"
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
              required
              placeholder="Confirmar Senha"
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

          {/* Exibe uma mensagem de erro se houver */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 rounded-lg text-white transition-colors bg-[#007bff] hover:bg-[#0056b3]"
          >
            REGISTRAR
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-[#a0aec0]">
            Já tem uma conta?{" "}
            <Link
              to="/"
              className="text-[#a0aec0] hover:text-[#007bff] transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
