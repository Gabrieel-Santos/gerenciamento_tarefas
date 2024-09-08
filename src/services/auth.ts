// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  // Obtém o token do localStorage
  const token = localStorage.getItem("token");

  // Verifica se o token existe e retorna verdadeiro se estiver presente
  return Boolean(token);
};

// Função para realizar logout
export const logout = (): void => {
  // Remove o token do localStorage, efetivamente deslogando o usuário
  localStorage.removeItem("token");
};
