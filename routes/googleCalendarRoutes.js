const express = require("express");
const router = express.Router();
const googleCalendarController = require("../controllers/googleCalendarController");

// Rotas para autenticação OAuth2
router.get("/google/auth", googleCalendarController.getAuthURL);
router.get("/oauth2callback", googleCalendarController.oauth2callback);

// Rota para criar evento
router.post("/api/calendar/event", googleCalendarController.createEvent);

module.exports = router;