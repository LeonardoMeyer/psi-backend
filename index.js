process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require("express");
const cors = require("cors");
const listRoutes = require("express-list-endpoints"); 
require("dotenv").config();

const app = express();

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const moodRoutes = require("./routes/moodRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const googleCalendarRoutes = require("./routes/googleCalendarRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/moods", moodRoutes);
app.use(protectedRoutes);
app.use(googleCalendarRoutes);
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/ping", (req, res) => {
  res.send("pong");
});

console.log("Rotas carregadas:");
console.table(listRoutes(app));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
