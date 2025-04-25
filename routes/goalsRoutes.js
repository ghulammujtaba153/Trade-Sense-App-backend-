import express from 'express'
import { createGoal, deleteGoal, getGoalsByUser, updateGoal } from '../controllers/goalsController.js'

const goalsRouter = express.Router()

goalsRouter.post("/", createGoal);

goalsRouter.get("/:id", getGoalsByUser);

goalsRouter.delete("/:id", deleteGoal);

goalsRouter.put("/:id", updateGoal);

export default goalsRouter;