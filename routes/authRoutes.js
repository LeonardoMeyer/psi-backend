const express = require("express");
const router = express.Router();
const multer = require("multer");
const { registerUser, loginUser, logoutUser, deleteUser, updateUser, uploadProfileImage } = require("../controllers/authController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", upload.single("image"), updateUser);  
router.post("/profile/upload-local-image/:id", upload.single("image"), uploadProfileImage);

module.exports = router;