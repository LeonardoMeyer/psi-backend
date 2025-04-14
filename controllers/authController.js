const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../config/emailService");

exports.registerUser = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('cpf').isLength({ min: 11, max: 11 }).withMessage('CPF inválido'),
  body('dateOfBirth').isDate().withMessage('Data de nascimento inválida'),
  
  async (req, res) => {
    const { cpf, email, password, dateOfBirth, profileImage } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email já registrado." });
      }

      const existingCpf = await prisma.user.findUnique({ where: { cpf } });
      if (existingCpf) {
        return res.status(400).json({ error: "CPF já registrado." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          cpf,
          email,
          password: hashedPassword,
          dateOfBirth: new Date(dateOfBirth),
          profileImage,
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      const confirmationLink = `http://localhost:5000/api/auth/confirm-email/${user.id}`;
      const emailText = `Olá ${user.email},\n\nPor favor, clique no link para confirmar seu e-mail: ${confirmationLink}`;
      await sendEmail(user.email, 'Confirmação de Cadastro', emailText);

      res.status(201).json(userWithoutPassword);
    } catch (err) {
      console.error("Erro ao registrar usuário:", err);
      res.status(400).json({ error: "Erro ao registrar usuário." });
    }
  }
];

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ error: "Erro ao fazer login. Tente novamente." });
  }
};

exports.logoutUser = async (req, res) => {
  res.json({ message: "Logout realizado com sucesso." });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Conta excluída com sucesso.", user: deletedUser });
  } catch (err) {
    console.error("Erro ao excluir usuário:", err);
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
};

exports.updateUser = [
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('password').optional().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('profileImage').optional().isURL().withMessage('Imagem de perfil inválida'),

  async (req, res) => {
    const { id } = req.params;
    const { email, password, profileImage } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (profileImage) updateData.profileImage = profileImage;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ message: "Dados atualizados com sucesso.", user: userWithoutPassword });
    } catch (err) {
      console.error("Erro ao atualizar dados:", err);
      res.status(500).json({ error: "Erro ao atualizar dados." });
    }
  }
];

exports.uploadProfileImage = async (req, res) => {
  console.log(req.file);
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Nenhuma imagem enviada." });
  }

  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: "profile_images" },
      async (error, result) => {
        if (error) {
          console.error("Erro do Cloudinary:", error);
          return res.status(500).json({ error: "Erro ao enviar imagem para Cloudinary." });
        }

        const updatedUser = await prisma.user.update({
          where: { id: parseInt(id) },
          data: { profileImage: result.secure_url }
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        res.json({ message: "Imagem enviada com sucesso.", user: userWithoutPassword });
      }
    );

    result.end(file.buffer);
  } catch (err) {
    console.error("Erro ao enviar imagem:", err);
    res.status(500).json({ error: "Erro ao enviar imagem." });
  }
};
