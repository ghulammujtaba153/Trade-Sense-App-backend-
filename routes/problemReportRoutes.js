import express from "express"
import { createProblem, getAllProblem, updateProblem } from "../controllers/problemReportController.js";


const problemReportRouter = express.Router()

problemReportRouter.post("/", createProblem);
problemReportRouter.get("/", getAllProblem);
problemReportRouter.patch("/:id", updateProblem)

export default problemReportRouter