import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../services/auth";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura do menu mobile
  const navigate = useNavigate();

  // Função para lidar com o logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Função para alternar o menu mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-2xl">
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/tasks" className="flex items-center py-5">
              <img src="./logo.png" alt="Logo" className="h-8 w-auto" />{" "}
            </NavLink>
          </div>

          {/* Links do menu para telas maiores */}
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

          {/* Menu mobile */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-[#004289] hover:text-[#007bff] hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:text-[#007bff]"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? "true" : "false"}
              aria-label="Abrir ou fechar o menu"
            >
              {/* Alterna o ícone entre abrir e fechar */}
              {isOpen ? (
                <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
              ) : (
                <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Menu para telas menores (mobile) */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white shadow-2xl z-50`} // Mostra ou oculta o menu com base no estado `isOpen`
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink
            to="/tasks"
            onClick={toggleMenu}
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 rounded-md text-base font-medium text-[#007bff]"
                : "block px-3 py-2 rounded-md text-base font-medium text-[#004289] hover:text-[#007bff] hover:bg-gray-200"
            }
          >
            Tarefas
          </NavLink>
          <NavLink
            to="/add-task"
            onClick={toggleMenu}
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 rounded-md text-base font-medium text-[#007bff]"
                : "block px-3 py-2 rounded-md text-base font-medium text-[#004289] hover:text-[#007bff] hover:bg-gray-200"
            }
          >
            Adicionar Tarefa
          </NavLink>
          <NavLink
            to="/profile"
            onClick={toggleMenu}
            className={({ isActive }) =>
              isActive
                ? "block px-3 py-2 rounded-md text-base font-medium text-[#007bff]"
                : "block px-3 py-2 rounded-md text-base font-medium text-[#004289] hover:text-[#007bff] hover:bg-gray-200"
            }
          >
            Perfil
          </NavLink>
          <button
            onClick={() => {
              handleLogout();
              toggleMenu();
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#004289] hover:text-[#f02849] hover:bg-gray-200"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
