import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <a href="/tasks" className="flex items-center py-5">
              <img src="./logo.png" alt="Logo" className="h-8 w-auto" />
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                isActive
                  ? "py-5 px-3 text-[#007bff] font-semibold"
                  : "py-5 px-3 text-[#004289] hover:text-[#007bff]"
              }
            >
              Tarefas
            </NavLink>
            <NavLink
              to="/add-task"
              className={({ isActive }) =>
                isActive
                  ? "py-5 px-3 text-[#007bff] font-semibold"
                  : "py-5 px-3 text-[#004289] hover:text-[#007bff]"
              }
            >
              Adicionar Tarefa
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "py-5 px-3 text-[#007bff] font-semibold"
                  : "py-5 px-3 text-[#004289] hover:text-[#007bff]"
              }
            >
              Perfil
            </NavLink>
            <button
              onClick={handleLogout}
              className="py-5 px-3 text-[#004289] hover:text-[#f02849]"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
