import express from "express";
import { createTermsCondition, deleteTermsCondition, getTermsCondition, updateTermsCondition } from "../controllers/termsConditionController.js";

const termsRouter = express.Router();

termsRouter.post("/", createTermsCondition);
termsRouter.get("/", getTermsCondition);
termsRouter.put("/:id", updateTermsCondition);
termsRouter.delete("/:id", deleteTermsCondition);

export default termsRouter;