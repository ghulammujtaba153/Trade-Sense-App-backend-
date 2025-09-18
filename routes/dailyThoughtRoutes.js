import express from "express";
import { createDailyThought, getDailyThought, getDailyThoughtById, updateDailyThought, deletDailyThought, getAllDailyThoughts } from "../controllers/dailyThoughtController.js";


const dailyThoughtRouter = express.Router();


dailyThoughtRouter.post("/create", createDailyThought);
dailyThoughtRouter.get("/get", getDailyThought);
dailyThoughtRouter.get("/all", getAllDailyThoughts);
dailyThoughtRouter.get("/get/:id", getDailyThoughtById);
dailyThoughtRouter.put("/update/:id", updateDailyThought);
dailyThoughtRouter.delete("/delete/:id", deletDailyThought);

export default dailyThoughtRouter;


