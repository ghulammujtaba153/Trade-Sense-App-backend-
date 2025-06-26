import express from "express"
import { createProblem, getAllProblem } from "../controllers/problemReportController.js";


const problemReportRouter = express.Router()

problemReportRouter.post("/", createProblem);
problemReportRouter.get("/", getAllProblem);

export default problemReportRouter