import express from 'express'
import { create, getTodayChat } from '../controllers/botController.js'

const botRouter = express.Router()

botRouter.post("/", create);
botRouter.get("/:id", getTodayChat)

export default botRouter;