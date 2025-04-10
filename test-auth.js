const axios = require("axios");

axios.post('http://localhost:5000/api/auth/register', {
    cpf: "98765432100",
    email: "leonardo2@email.com",
    password: "123456"
})
.then(response => {
  console.log("Usuário registrado com sucesso:", response.data);
})
.catch(error => {
  if (error.response) {
    console.error("Erro na resposta da API:", error.response.data);
  } else {
    console.error("Erro ao fazer requisição:", error.message);
  }
});
