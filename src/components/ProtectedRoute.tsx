import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

const ProtectedRoute: React.FC = () => {
  const isAuth = isAuthenticated();

  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!isAuth) {
    return <Navigate to="/" />;
  }

  // Se estiver autenticado, renderiza os componentes filhos (rotas protegidas)
  return <Outlet />;
};

export default ProtectedRoute;
