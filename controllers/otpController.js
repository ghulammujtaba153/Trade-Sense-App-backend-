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

    // Send email
    await transporter.sendMail({
      from: `"Trader365" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otpCode}`,
      html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="margin: 0; color: #4A90E2;">Trader365</h2>
      <p style="color: #888; margin-top: 4px;">Secure Verification</p>
    </div>
    
    <div style="text-align: center;">
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">Use the following OTP code to complete your verification:</p>
      <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #4A90E2;">${otpCode}</div>
      <p style="font-size: 14px; color: #555;">This code will expire in 10 minutes.</p>
    </div>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

    <p style="font-size: 12px; color: #999; text-align: center;">
      If you did not request this code, please ignore this email or contact support.
    </p>
  </div>
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
