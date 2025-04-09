const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.registerUser = async (req, res) => {
  const { cpf, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { cpf, email, password: hashedPassword },
    });
    res.status(201).json(user);
  } catch (err) {
    console.error("Erro ao registrar usuário:", err); // já tá aí, mas vamos garantir
    res.status(400).json({ error: "Erro ao registrar usuário." });
  }
};


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
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};
