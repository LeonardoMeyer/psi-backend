const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadProfileImage } = require("../controllers/authController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload-local-image/:id", upload.single("image"), uploadProfileImage);

module.exports = router;
