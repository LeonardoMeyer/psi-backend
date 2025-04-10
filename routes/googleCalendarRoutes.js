const express = require("express");
const router = express.Router();
const googleCalendarController = require("../controllers/googleCalendarController");

router.get("/google/auth", googleCalendarController.getAuthURL);
router.get("/oauth2callback", googleCalendarController.oauth2callback);

router.post("/api/calendar/event", googleCalendarController.createEvent);

module.exports = router;