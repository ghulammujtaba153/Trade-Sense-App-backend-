import express from "express";
import { createWelcome, getWelcome } from "../controllers/welcomeController.js";


const welcomeRouter = express.Router();

welcomeRouter.post("/", createWelcome);
welcomeRouter.get("/", getWelcome);

export default welcomeRouter;