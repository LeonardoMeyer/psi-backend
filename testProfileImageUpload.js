const axios = require("axios");

async function updateProfileImage() {
  try {
    const userId = 3; 
    const profileImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAvrD8_s-u5ohTkC_sZG0ofaLEwVsVTw2yGw&s"; 

    const response = await axios.put(`http://localhost:5000/api/profile/upload-profile-image/${userId}`, {
      profileImage: profileImageUrl
    });

    console.log("✅ Imagem de perfil atualizada:");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Erro ao atualizar imagem:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Dados do erro:", error.response.data);
    } else {
      console.error("Mensagem:", error.message);
    }
  }
}

updateProfileImage();