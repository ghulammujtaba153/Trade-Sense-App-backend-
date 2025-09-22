// import otpGenerator from "otp-generator";
// import nodemailer from "nodemailer";
// import Otp from "../models/otpSchema.js";
// import User from "../models/userSchema.js";

import dotenv from "dotenv";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import Otp from "../models/otpSchema.js";
import User from "../models/userSchema.js";

dotenv.config(); // load .env variables

export const sendOtp = async (req, res) => {
  const { email, registeration, forgetPassword } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // Check user existence based on request type
    const existingUser = await User.findOne({ email });

    if (registeration && existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    if (forgetPassword && !existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Generate 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    console.log("Generated OTP:", otpCode);

    // Save or update OTP in DB
    await Otp.findOneAndUpdate(
      { email },
      { code: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Configure Hostinger SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // your full email (e.g. info@yourdomain.com)
        pass: process.env.EMAIL_PASS, // email password from Hostinger
      },
    });

    // Optional: verify SMTP connection
    transporter.verify((err, success) => {
      if (err) {
        console.error("SMTP Connection Error:", err);
      } else {
        console.log("SMTP Server Ready");
      }
    });


    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    // Send email
    await transporter.sendMail({
      from: `"Trader365" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otpCode}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your One-Time Password (OTP) for Secure Access</title>
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <style>
    @media (prefers-color-scheme: dark) {
      body, table, td { background-color: #0b1016 !important; color: #e2e8f0 !important; }
      .text { color: #e2e8f0 !important; }
      .otp { color: #ffffff !important; }
    }
  </style>
  </head>
  <body style="margin:0;padding:0;background-color:#ffffff;color:#111111;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff;min-height:100vh;">
      <tr>
        <td align="center" valign="top" style="padding: 32px 16px;">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff;">
            <tr>
              <td class="text" style="color:#111111;font-size:16px;line-height:1.7;">
                <p style="margin:0 0 16px;">Dear Trader,</p>
                <p style="margin:0 0 16px;">To proceed with your secure login/verification, please use the following One-Time Password (OTP):</p>
                <p style="margin:0 0 16px;font-size:18px;">
                  <strong>🔐 OTP:&nbsp;<span class="otp" style="font-family:'Courier New', monospace; letter-spacing: 2px; color:#111111;">${otpCode}</span></strong>
                </p>
                <p style="margin:0 0 16px;">This code is valid for the next <strong>10 minutes</strong> and can only be used once. Please do not share this OTP with anyone.</p>
                <p style="margin:0 0 16px;">If you did not request this code, please ignore this email or contact our support team immediately.</p>
                <p style="margin:24px 0 0;">Thank you for choosing <strong>Trader 365</strong></p>
                <p style="margin:8px 0 0;">Warm regards,</p>
                <p style="margin:0; font-weight:600;">Traders 365</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,

    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};





export const verifyOtp = async (req, res) => {
  const { email, code } = req.body;

  console.log(email, code);

  if (!email || !code)
    return res.status(400).json({ message: "Email and code are required" });

  try {
    const otp = await Otp.findOne({ email });

    if (!otp) return res.status(404).json({ message: "OTP not found" });

    if (otp.code !== code)
      return res.status(400).json({ message: "Invalid OTP" });

    if (new Date() - otp.createdAt > 10 * 60 * 1000)
      return res.status(400).json({ message: "OTP expired" });
    await Otp.deleteOne({ email });

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
