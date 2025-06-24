import express from 'express'
import { create } from '../controllers/botController.js'

const botRouter = express.Router()

botRouter.post("/", create);

export default botRouter;