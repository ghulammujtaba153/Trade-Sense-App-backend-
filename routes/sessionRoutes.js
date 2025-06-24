import express from "express"
import { createSession } from "../controllers/sessionController.js"

const sessionRouter = express.Router()

sessionRouter.get("/start", createSession);

export default sessionRouter