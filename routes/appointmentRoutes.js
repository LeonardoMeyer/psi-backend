const express = require("express");
const router = express.Router();
const { createAppointment, getAvailableSlots } = require("../controllers/appointmentController");

router.post("/create", createAppointment);
router.get("/slots", getAvailableSlots);

module.exports = router;