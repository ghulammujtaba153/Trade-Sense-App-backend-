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
  <title>Trader365 - Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b1016;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b1016; min-height: 100vh;">
    <tr>
      <td align="center" valign="top">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b1016; padding: 40px 20px;">
          
          <!-- Header Section -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <img src="${baseUrl}/assets/logo-template.png" alt="Trader 365 badge" style="max-width: 180px;" />
              <h2 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 12px 0 8px;">Hi,</h2>
              <p style="color: #a0aec0; font-size: 14px; margin: 0; line-height: 1.5;">
                You recently requested to ${registeration ? 'register' : forgetPassword ? 'reset your password' : 'sign in'} for your Trader365 account. Use the verification code below to ${registeration ? 'complete your registration' : forgetPassword ? 'reset your password' : 'sign in'}.
              </p>
            </td>
          </tr>

          <!-- Verification Code Section -->
          <tr>
            <td align="center" style="padding: 32px 20px;">
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 24px; letter-spacing: -0.5px;">
                Verification Code
              </h1>
              <div style="background: #70C2E8; border-radius: 12px; padding: 20px; margin: 24px auto; box-shadow: 0 4px 16px rgba(79, 156, 249, 0.3); display: inline-block;">
                <div style="font-size: 36px; font-weight: 700; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otpCode}
                </div>
              </div>
              <p style="color: #a0aec0; font-size: 14px; line-height: 1.6; margin: 24px 0 0; padding: 0 16px;">
                Use the verification code above to complete your sign in or verification process. For security, this code will expire in 10 minutes. If you did not request this code, please ignore this email or contact our support team immediately.
              </p>
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
