import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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

          {/* Botão do menu hambúrguer */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-[#004289] hover:text-[#007bff] hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:text-[#007bff]"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? "true" : "false"}
            >
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white shadow-2xl z-50`}
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
