const { google } = require("googleapis");
const path = require("path");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5000/oauth2callback"
);

// Gera URL para autenticar via navegador
exports.getAuthURL = (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url);
};

// Callback após autenticação
exports.oauth2callback = async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  
  console.log("🔑 Tokens recebidos do Google:");
  console.log(tokens); 
  
  res.send("Autenticado com sucesso! Agora você pode fechar esta janela.");
};

// Criar evento no Google Calendar
exports.createEvent = async (req, res) => {
  const { summary, description, startDateTime, endDateTime } = req.body;
  
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN, // você salvará este token após autenticação
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary,
        description,
        start: { dateTime: startDateTime },
        end: { dateTime: endDateTime },
      },
    });
    res.json({ event: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};