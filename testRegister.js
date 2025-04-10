const axios = require("axios");

function formatDateToISO(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}T00:00:00.000Z`; 
}

async function testRegister() {
  const dateOfBirthInput = "05/02/1958";
  const formattedDate = formatDateToISO(dateOfBirthInput);

  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", {
      cpf: "99999999999",
      email: "teste999@email.com",
      password: "senha123",
      dateOfBirth: formattedDate
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
