import express from "express";
import { welcomeMail } from "../controllers/templateController.js";


const welcomeMailRouter = express.Router();

welcomeMailRouter.post("/", welcomeMail)


export default welcomeMailRouter;