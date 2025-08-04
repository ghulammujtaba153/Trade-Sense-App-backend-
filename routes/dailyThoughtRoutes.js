import express from "express";
import { createDailyThought, getDailyThought, getDailyThoughtById, updateDailyThought, deletDailyThought, getDailyThoughts } from "../controllers/dailyThoughtController.js";


const dailyThoughtRouter = express.Router();


dailyThoughtRouter.post("/create", createDailyThought);
dailyThoughtRouter.get("/get", getDailyThought);
dailyThoughtRouter.get("/get-all", getDailyThoughts);
dailyThoughtRouter.get("/get/:id", getDailyThoughtById);
dailyThoughtRouter.put("/update/:id", updateDailyThought);
dailyThoughtRouter.delete("/delete/:id", deletDailyThought);

export default dailyThoughtRouter;


