import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFB800] text-black py-6">
      {" "}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Informações de contato */}
          <div className="text-center md:text-left">
            <p className="font-bold">Phone:</p>
            <p>+55 32 9 84580814</p>
            <p className="mt-2 font-bold">Email:</p>
            <p>maginovam@gmail.com</p>
          </div>

          {/* Direitos autorais */}
          <div className="text-center">
            <p className="font-bold">
              &copy; Copyright Gerenciamento de Tarefas. All Rights Reserved
            </p>
          </div>

          {/* Links para redes sociais */}
          <div className="flex justify-center space-x-4">
            <a
              href="https://www.linkedin.com/in/gabrielsatr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0077b5] hover:text-black transition-colors"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a
              href="https://github.com/Gabrieel-Santos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#333] hover:text-black transition-colors"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
