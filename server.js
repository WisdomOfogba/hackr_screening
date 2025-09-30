require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route for handling submissions
app.post("/submit", async (req, res) => {
  const {
    name,
    email,
    skills,
    role,
    level,
    experience,
    availability,
    github,
    linkedin,
    portfolio,
  } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: "🚀 New Hackr Team Screening Submission",
    text: `
📌 New Applicant for Hackr Team

👤 Name: ${name}
📧 Email: ${email}
🛠 Skills: ${skills}
🎯 Preferred Role: ${role}
📊 Experience Level: ${level}
🏆 Hackathon/Project Experience: ${experience}
💻 GitHub: ${github || "N/A"}
🔗 LinkedIn: ${linkedin || "N/A"}
🌍 Portfolio: ${portfolio || "N/A"}
⏰ Availability: ${availability}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("<h2>✅ Thanks for applying! We'll be in touch soon.</h2>");
  } catch (error) {
    console.error(error);
    res.send("<h2>❌ Error sending email. Try again later.</h2>");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
