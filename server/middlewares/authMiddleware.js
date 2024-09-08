import jwt from "jsonwebtoken";

// Middleware de autenticação por token JWT
export const authenticateToken = (req, res, next) => {
  // Obtém o token do cabeçalho "Authorization"
  const authHeader = req.headers["authorization"];

  // Verifica se o token está presente
  if (!authHeader)
    return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1]; // Extrai o token da string "Bearer <token>"

  // Verifica se o token é válido
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    // Adiciona o usuário ao objeto req para uso posterior nas rotas
    req.user = user;
    next();
  });
};
