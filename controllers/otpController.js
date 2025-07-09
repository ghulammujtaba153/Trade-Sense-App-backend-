import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import Otp from "../models/otpSchema.js";
import User from "../models/userSchema.js";

export const sendOtp = async (req, res) => {
  const { email, registeration, forgetPassword } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  if (registeration) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
  } else if (forgetPassword) {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
  }

  try {
    const otpCode = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
      digits: true,
    });

    await Otp.findOneAndUpdate(
      { email },
      { code: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}`,
    });

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
