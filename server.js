/**
 * Backend to send emails when there is availability
 */

/**
 * import packages
 */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

/**
 * define email functions
 */

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SENDER_EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  const emailTransporter = await createTransporter();
  return emailTransporter.sendMail(emailOptions);
};

//server
const PORT = 8080;
const app = express();

// Enable middleware
app.use(cors());
app.use(bodyParser.json());

//POST requests to '/reservation'
app.post("/reservation", (req, res) => {
  const { message, href } = req.body;
  console.log(req.body);

  sendEmail({
    subject: "Your reservation has availability.  Book at open table now!",
    text: `${message}\n\n${href}\n\nI am sending an email from nodemailer!`,
    to: process.env.RECIEVER_EMAIL,
    from: process.env.SENDER_EMAIL,
  })
    .then((res) => console.log(res))
    .catch((e) => console.log(e));

  res.send("Data received successfully!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
