const axios = require("axios");

axios.post('http://localhost:5000/api/auth/register', {
    cpf: "12345678900",
    email: "leonardo@email.com",
    password: "123456"
  })
  
.then(response => {
  console.log("Usuário registrado:", response.data);
})
.catch(error => {
  if (error.response) {
    console.error("Erro na resposta da API:", error.response.data);
  } else {
    console.error("Erro ao fazer requisição:", error.message);
  }
});
