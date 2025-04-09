const axios = require("axios");

async function testProtected() {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NDIzNDk1OSwiZXhwIjoxNzQ0ODM5NzU5fQ.JTkPta8xK9AFZJ5YEKRMg3stguMeIsIfS2JJEfWAXtQ'; 
    const response = await axios.get("http://localhost:5000/api/perfil", {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("✅ Acesso permitido à rota protegida:");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Erro ao acessar rota protegida:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Dados do erro:", error.response.data);
    } else {
      console.error("Mensagem:", error.message);
    }
  }
}

testProtected();
