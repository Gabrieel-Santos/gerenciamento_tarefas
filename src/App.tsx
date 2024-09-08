import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./components/Login";
import Registrar from "./components/Register";
import AddTask from "./components/AddTask";
import Tasks from "./components/Tasks";
import TaskDetail from "./components/TaskDetail";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registrar />} />

        {/* Rotas protegidas, acessíveis apenas por usuários autenticados */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <>
                <Navbar />
                <Outlet /> {/* Outlet para renderizar os componentes filhos */}
                <Footer />
              </>
            }
          >
            <Route path="/profile" element={<Profile />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
          </Route>
        </Route>

        {/* Redireciona qualquer rota inválida para "/tasks" */}
        <Route path="*" element={<Navigate to="/tasks" />} />
      </Routes>
    </Router>
  );
};

export default App;
