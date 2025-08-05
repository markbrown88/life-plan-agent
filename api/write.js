const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  SCOPES
);

const sheets = google.sheets({ version: "v4", auth });

app.post("/api/write", async (req, res) => {
  const { spreadsheetId, range, values } = req.body;

  try {
    const result = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    res.json({ message: "Success", updatedRange: result.data.updatedRange });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove server.listen — we don't need it in Vercel
module.exports = app;
