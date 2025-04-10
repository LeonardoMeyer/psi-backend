const express = require("express");
const router = express.Router();
const multer = require("multer");
const { registerUser, loginUser, uploadProfileImage } = require("../controllers/authController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/profile/upload-local-image/:id", upload.single("image"), uploadProfileImage);

module.exports = router;
