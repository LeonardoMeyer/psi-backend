const { google } = require("googleapis");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

exports.createAppointment = async (req, res) => {
  const { userId, dateTime } = req.body;
  try {
    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: "Sessão de Psicologia",
        description: `Consulta agendada pelo paciente ID ${userId}`,
        start: { dateTime, timeZone: "America/Sao_Paulo" },
        end: { dateTime: new Date(new Date(dateTime).getTime() + 50 * 60000).toISOString(), timeZone: "America/Sao_Paulo" },
      },
    });

    await prisma.appointment.create({
      data: {
        userId,
        dateTime,
        googleEventId: event.data.id,
      },
    });

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao agendar." });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const busyEvents = await calendar.freebusy.query({
      requestBody: {
        timeMin: new Date().toISOString(),
        timeMax: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        timeZone: "America/Sao_Paulo",
        items: [{ id: "primary" }],
      },
    });
    const busy = busyEvents.data.calendars.primary.busy;
    const available = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      for (let h = 8; h < 18; h++) {
        const slot = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h);
        const overlap = busy.find(b => new Date(b.start) <= slot && new Date(b.end) > slot);
        if (!overlap) available.push(slot);
      }
    }
    res.json({ available });
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter horários." });
  }
};