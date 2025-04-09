const axios = require("axios");

async function testRegister() {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", {
        cpf: "12345678901",
        email: "novo@teste.com",
        password: "senha123"
      });
      

    console.log("✅ Cadastro feito com sucesso:");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Erro no cadastro:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Dados do erro:", error.response.data);
    } else {
      console.error("Mensagem:", error.message);
    }
  }
}

testRegister();
