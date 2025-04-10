const axios = require("axios");
const fs = require("fs");

async function testUpload() {
  const formData = new FormData();
  formData.append("image", fs.createReadStream("example.jpg"));

  try {
    const response = await axios.post("http://localhost:5000/api/profile/upload-local-image/1", formData, {
      headers: formData.getHeaders(),
    });

    console.log("✅ Imagem de perfil atualizada com sucesso:", response.data);
  } catch (error) {
    console.error("❌ Erro ao enviar imagem:", error.response?.data || error.message);
  }
}

testUpload();