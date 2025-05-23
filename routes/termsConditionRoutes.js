import express from "express";
import { createTermsCondition, getTermsCondition } from "../controllers/termsConditionController.js";

const termsRouter = express.Router();

termsRouter.post("/", createTermsCondition);
termsRouter.get("/", getTermsCondition);

export default termsRouter;