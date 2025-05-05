import express from "express";
import { createPlan, deletePlan, getMembershipPlan, getPlans, updatePlan } from "../controllers/planController.js";

const planRouter = express.Router();

planRouter.post("/", createPlan);
planRouter.get("/", getPlans);
planRouter.put("/:id", updatePlan);
planRouter.delete("/:id", deletePlan);
planRouter.get("/membership", getMembershipPlan);

export default planRouter;