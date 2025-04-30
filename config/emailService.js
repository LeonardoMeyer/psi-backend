const nodemailer = require('nodemailer');
require('dotenv').config();

// Criar o transporte com as credenciais armazenadas no .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Email do remetente
    pass: process.env.EMAIL_PASS  // Senha do remetente (senha de aplicativo se tiver 2FA ativado)
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Remetente
    to, // Destinatário
    subject, // Assunto do e-mail
    text, // Corpo do e-mail
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado para ${to}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail: ', error);
  }
};

module.exports = sendEmail;
