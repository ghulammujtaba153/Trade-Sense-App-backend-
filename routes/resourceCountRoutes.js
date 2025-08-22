import express from "express";
import { createResourceCount } from "../controllers/resourceCountController.js";

const resourceCountRouter = express.Router();

resourceCountRouter.post("/", createResourceCount);

export default resourceCountRouter;