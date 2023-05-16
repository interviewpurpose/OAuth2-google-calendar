require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");

const dayjs = require('dayjs')
const calendar = google.calendar({
  version: "v3",
  auth: process.env.API_KEY,
})

const app = express();

//oauth2 keys
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
const scopes = ["https://www.googleapis.com/auth/calendar"];


app.get("/rest/v1/calendar/init", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes
  });
  res.redirect(url);
});

app.get("/rest/v1/calendar/redirect", async(req, res) => {

// token
  const code = req.query.code;
  const {tokens} = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);
  
  res.send({
    msg: "You have successfully logged in"
  });
});

app.get('/schedule_event', async(req,res) => {
  //console.log(oauth2Client.credentials.access_token);

   await calendar.events.insert ({
    calendarId: "primary",
    auth: oauth2Client,
    conferenceDataVersion: 1,
    requestBody: {
      summary: "Do backend and frontend task ",
      description: "Some event that is very important",
      start : {
        dateTime: dayjs(new Date()).add(1, 'day').toISOString(),
        timeZone:"Asia/Kolkata"
      },
      end: {
        dateTime: dayjs(new Date()).add(1, 'day').add(1, 'hour').toISOString(),
        timeZone:"Asia/Kolkata"
      },
      
    },
  });

  res.send({
    msg: "Done",
  });

});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
