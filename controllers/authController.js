const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.registerUser = async (req, res) => {
  const { cpf, email, password, dateOfBirth, profileImage } = req.body;
  try {
    if (!dateOfBirth) {
      return res.status(400).json({ error: "Data de nascimento é obrigatória." });
    }

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
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error("Erro ao registrar usuário:", err); 
    res.status(400).json({ error: "Erro ao registrar usuário." });
  }  
};

exports.updateProfileImage = async (req, res) => {
  const { id } = req.params;
  const { profileImage } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { profileImage },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({ message: "Imagem de perfil atualizada com sucesso.", user: userWithoutPassword });
  } catch (error) {
    console.error("Erro ao atualizar imagem de perfil:", error);
    res.status(500).json({ error: "Erro ao atualizar imagem de perfil." });
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

    const { password: _, ...userWithoutPassword } = user;

    console.log("Usuário logado:", userWithoutPassword);

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ error: "Erro ao fazer login. Tente novamente." });
  }
};
