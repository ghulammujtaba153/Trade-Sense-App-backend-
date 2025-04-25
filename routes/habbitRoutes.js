import express from 'express'
import { createHabbit, deleteHabbit, getHabbitsByUser, updateHabbit } from '../controllers/habbitController.js';


const habbitRouter = express.Router()

habbitRouter.post("/", createHabbit);

habbitRouter.get("/:id", getHabbitsByUser);

habbitRouter.delete("/:id", deleteHabbit);

habbitRouter.put("/:id", updateHabbit);

export default habbitRouter;