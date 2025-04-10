const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
          console.error("Erro ao enviar imagem para Cloudinary:", error);
          return res.status(500).json({ error: "Erro ao enviar imagem para Cloudinary." });
        }

        const updatedUser = await prisma.user.update({
          where: { id: parseInt(id) },
          data: { profileImage: result.secure_url },
        });

        const { password: _, ...userWithoutPassword } = updatedUser;

        res.json({ message: "Imagem de perfil enviada com sucesso.", user: userWithoutPassword });
      }
    );

    result.end(file.buffer);
  } catch (err) {
    console.error("Erro ao enviar imagem:", err);
    res.status(500).json({ error: "Erro ao enviar imagem." });
  }
};
