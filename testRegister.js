const axios = require("axios");

function formatDateToISO(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
}

async function testRegister() {
  const dateOfBirthInput = "05/02/1958";
  const formattedDate = formatDateToISO(dateOfBirthInput);

  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", {
      cpf: "88888888888",
      email: "imgteste@email.com",
      password: "senha123",
      dateOfBirth: formattedDate,
      profileImage: "https://i.pravatar.cc/300" // 👈 Exemplo de URL
    });

    console.log("✅ Usuário registrado com sucesso:");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Erro no registro:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Dados do erro:", error.response.data);
    } else {
      console.error("Mensagem:", error.message);
    }
  }
}

testRegister();
