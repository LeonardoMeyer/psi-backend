const sendEmail = require('./config/emailService');

async function testEmail() {
  try {
    await sendEmail('dudamanfredo@gmail.com', 'para de ser chata amor', 'te amo de qualquer forma');
    console.log('E-mail enviado com sucesso!');
  } catch (err) {
    console.error('Erro ao enviar o e-mail:', err);
  }
}

testEmail();