import app from "./app.js";

const PORT = 5000;

// Inicia o servidor e escuta na porta definida
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
