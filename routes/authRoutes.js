const express = require("express");
const router = express.Router();

const { registerUser, loginUser, updateProfileImage } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/profile/upload-profile-image/:id", updateProfileImage);

module.exports = router;
