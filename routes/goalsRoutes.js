import express from 'express'
import { createGoal, deleteGoal, getGoals, getGoalsByUser, goalAnalysis, updateGoal, updateGoalStatus } from '../controllers/goalsController.js'

const goalsRouter = express.Router()

goalsRouter.post("/", createGoal);

goalsRouter.get("/", getGoals);

goalsRouter.get("/:id", getGoalsByUser);

goalsRouter.delete("/:id", deleteGoal);

goalsRouter.put("/:id", updateGoal);

goalsRouter.post("/:id", updateGoalStatus);

goalsRouter.get("/analysis/win", goalAnalysis);

export default goalsRouter;