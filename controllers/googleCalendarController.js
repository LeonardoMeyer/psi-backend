const { google } = require("googleapis");
const path = require("path");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5000/oauth2callback"
);

exports.getAuthURL = (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url);
};

exports.oauth2callback = async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  
  console.log("🔑 Tokens recebidos do Google:");
  console.log(tokens); 
  
  res.send("Autenticado com sucesso! Agora você pode fechar esta janela.");
};

exports.createEvent = async (req, res) => {
  const { summary, description, startDateTime, endDateTime } = req.body;
  
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN, 
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