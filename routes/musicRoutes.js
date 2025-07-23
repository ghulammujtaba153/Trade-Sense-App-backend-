import express from "express";
import { createMusic, deleteMusic, getAllMusic, getMusicById, updateMusic } from "../controllers/musicController.js";

const musicRouter = express.Router();

musicRouter.post("/", createMusic);
musicRouter.get("/", getAllMusic);
musicRouter.get("/:id", getMusicById);
musicRouter.put("/:id", updateMusic);
musicRouter.delete("/:id", deleteMusic);

export default musicRouter;