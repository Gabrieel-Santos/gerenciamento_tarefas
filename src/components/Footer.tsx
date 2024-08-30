import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFB800] text-black py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold">Phone:</p>
            <p>+55 32 9 84580814</p>
            <p className="mt-2 font-bold">Email:</p>
            <p>maginovam@gmail.com</p>
          </div>
          <div className="text-center">
            <p className="font-bold">
              &copy; Copyright Gerenciamento de Tarefas. All Rights Reserved
            </p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/in/gabrielsatr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0077b5] hover:text-black transition-colors"
            >
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a
              href="https://github.com/Gabrieel-Santos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#333] hover:text-black transition-colors"
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
