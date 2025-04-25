import express from 'express'
import { sendOtp, verifyOtp } from '../controllers/otpController.js';

const otpRouter = express.Router();

otpRouter.post('/sendOTP', sendOtp);
otpRouter.post('/verifyOTP', verifyOtp);

export default otpRouter