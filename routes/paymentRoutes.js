import express from "express";
import { createPayment, getPayments, updateStatus } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/", createPayment);
paymentRouter.get("/:id", getPayments);
paymentRouter.put("/:id", updateStatus);

export default paymentRouter;