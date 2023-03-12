import * as dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAILADDRESS,
    pass: process.env.EMAILPASSWORD,
  },
});

export const sendEmail = ({
  to = process.env.EMAILADDRESS,
  subject = "You received a message",
  message = "Somebody has sent you a message from your website",
  res = false,
  successMessage = "Email sent successfully",
  replyTo = null,
  html,
}) => {
  // create the emailData object
  const emailData = {
    from: process.env.EMAILADDRESS,
    to, // recipient
    subject: subject, // Subject line
    text: message, // plain text body
    html,
  };

  if (replyTo !== null) {
    emailData.replyTo = replyTo;
  }

  // send the email
  transporter
    .sendMail(emailData)
    .then(() => {
      // and return a 200 if response was provided
      if (res) {
        return res.status(200).send(successMessage);
      }
    })
    .catch((err) => {
      callback(err);
    });
};
