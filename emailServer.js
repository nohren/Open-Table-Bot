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

/**
 * define email functions
 */

//Oauth somehow broke or expired and gathering the useful knobs is also time consuming
//generating a google account app password is less troublesome and fickle
const sendEmail = (emailOptions) => {
  const emailConfig = {
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  };
  const emailTransporter = nodemailer.createTransport(emailConfig);
  return emailTransporter.sendMail(emailOptions);
};

const PORT = 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json());

//POST requests to '/reservation'
app.post("/reservation", (request, response) => {
  const { message, href } = request.body;

  sendEmail({
    subject: "Your reservation has availability.  Book at open table now!",
    text: `${message}\n\n${href}\n\nI am sending an email from nodemailer!`,
    to: process.env.RECIEVER_EMAIL,
    from: process.env.SENDER_EMAIL,
  })
    .then((res) => {
      console.log(res);
      response.status(200).send(res);
    })
    .catch((e) => {
      console.log(e);
      response.status(500).send(e);
    });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
