import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

const ProtectedRoute: React.FC = () => {
  const isAuth = isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
