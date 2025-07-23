import express from "express";
import { createPayment, getPayments, getWithdrawalRequests, updateStatus } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/", createPayment);
paymentRouter.get("/:id", getPayments);
paymentRouter.put("/:id", updateStatus);
paymentRouter.get("/", getWithdrawalRequests);

export default paymentRouter;