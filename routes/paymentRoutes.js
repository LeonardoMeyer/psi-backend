const express = require("express");
const router = express.Router();
const { createCheckoutSession, confirmPixPayment } = require("../controllers/paymentController");

router.post("/checkout", createCheckoutSession);
router.post("/pix/confirm", confirmPixPayment);

module.exports = router;