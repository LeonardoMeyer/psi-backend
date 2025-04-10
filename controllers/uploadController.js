const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.uploadProfileImage = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "Nenhuma imagem enviada." });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_images",
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.warn("Erro ao deletar o arquivo local:", err);
    });

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { profileImage: result.secure_url },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({
      message: "Imagem de perfil atualizada com sucesso.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    res.status(500).json({ error: "Erro ao fazer upload da imagem." });
  }
};
