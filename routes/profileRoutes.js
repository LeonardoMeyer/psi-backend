const express = require("express");
const router = express.Router();
const { uploadProfileImage } = require("../controllers/authController");

router.post("/upload-local-image/:id", uploadProfileImage);  // Certifique-se de que a função está sendo passada corretamente

module.exports = router;
