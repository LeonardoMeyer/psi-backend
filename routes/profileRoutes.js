const express = require("express");
const router = express.Router();
const { updateProfileImage } = require("../controllers/authController");

router.put("/upload-profile-image/:id", updateProfileImage);

module.exports = router;
