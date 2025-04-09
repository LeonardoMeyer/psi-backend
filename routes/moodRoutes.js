const express = require("express");
const router = express.Router();
const { registerMood, getUserMoods } = require("../controllers/moodController");

router.post("/register", registerMood);
router.get("/user/:userId", getUserMoods);

module.exports = router;