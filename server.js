import nodemailer from "nodemailer";
import multer from "multer";
import nextConnect from "next-connect";

const upload = multer();
// Email credentials
const userEmail = process.env.USER_EMAIL || "boltdropa@gmail.com";
const userPass = process.env.USER_PASS || "qeqzjijyihplkplt";

const handler = nextConnect();

handler.use(upload.fields([{ name: "selfie" }, { name: "idCard" }]));

handler.post(async (req, res) => {
  const {
    fullName,
    homeAddress,
    phoneNumber,
    idCardNumber,
    totalPrice,
    items,
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

export const config = {
  api: {
    bodyParser: false, // Required for multer
  },
};

export default handler;
