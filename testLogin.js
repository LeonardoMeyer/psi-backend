const axios = require("axios");

async function testLogin() {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email: "novo@teste.com",
      password: "senha123"
    });

    console.log("✅ Login feito com sucesso!");
    console.log("🔐 Token JWT:", response.data.token);

    if (response.data.user) {
      console.log("👤 Usuário autenticado:");
      console.log(response.data.user);
    }
  } catch (error) {
    console.error("❌ Erro ao tentar fazer login:");
    if (error.response) {
      console.error("📌 Status:", error.response.status);
      console.error("📨 Dados do erro:", error.response.data);
    } else {
      console.error("🚫 Mensagem:", error.message);
    }
  }
}

testLogin();
