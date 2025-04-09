const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/api/perfil", authMiddleware, async (req, res) => {
  res.json({ mensagem: "Usuário autenticado", userId: req.userId });
});

module.exports = router;
