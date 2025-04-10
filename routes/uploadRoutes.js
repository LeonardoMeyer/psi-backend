const express = require("express");
const multer = require("multer");
const { uploadToCloudinary } = require("../utils/cloudinary");
const fs = require("fs");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await uploadToCloudinary(filePath);
    fs.unlinkSync(filePath);

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro ao fazer upload da imagem." });
  }
});

module.exports = router;