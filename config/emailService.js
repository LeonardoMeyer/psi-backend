const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendEmail = async (to, subject, templateName, context) => {
  try {
    const templateSource = fs.readFileSync(`./templates/${templateName}.html`, 'utf-8');
    const template = handlebars.compile(templateSource);

    const htmlToSend = template(context);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlToSend,
    };

    await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado para ${to}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail: ', error);
  }
};

module.exports = sendEmail;
