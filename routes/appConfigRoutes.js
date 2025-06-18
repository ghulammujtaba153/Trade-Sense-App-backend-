import express from "express"
import { createConfig, getConfig } from "../controllers/appConfigController.js"

const configRouter = express.Router()

configRouter.post("/", createConfig)
configRouter.get("/", getConfig)

export default configRouter