const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function uploadProfileImage() {
  const form = new FormData();
  const imagePath = path.join('C:', 'Users', 'Propulsor404', 'Downloads', 'example.jpg');

  form.append('image', fs.createReadStream(imagePath));

  try {
    const response = await axios.post('http://localhost:5000/api/profile/upload-local-image/3', form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    console.log('Resposta:', response.data);
  } catch (error) {
    console.error('Erro ao enviar imagem:', error.response?.data || error.message);
  }
}

uploadProfileImage();