import express from "express"
import { createMood, getMood, updateMood } from "../controllers/moodController.js"


const moodRouter = express.Router()


moodRouter.post("/", createMood);

moodRouter.get("/:id", getMood);

moodRouter.patch("/:id", updateMood);


export default moodRouter