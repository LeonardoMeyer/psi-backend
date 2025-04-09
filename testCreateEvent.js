const axios = require("axios");

async function createEvent() {
  try {
    const response = await axios.post("http://localhost:5000/api/calendar/event", {
      summary: "Sessão de Psicoterapia",
      description: "Sessão de teste criada via integração com Google Agenda",
      startDateTime: "2025-04-15T14:00:00-03:00",
      endDateTime: "2025-04-15T15:00:00-03:00"
    });

    console.log("✅ Evento criado com sucesso:");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Erro ao criar evento:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Dados do erro:", error.response.data);
    } else {
      console.error("Mensagem:", error.message);
    }
  }
}

createEvent();