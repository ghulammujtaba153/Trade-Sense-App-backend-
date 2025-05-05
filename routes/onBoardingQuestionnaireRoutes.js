import express from "express"
import { createOnBoardingQuestionnaire, deleteOnBoardingQuestionnaire, getOnBoardingQuestionnaire, updateOnBoardingQuestionnaire } from "../controllers/onBoardingQuestionnaireController.js";

const onBoardingQuestionnaireRouter = express.Router();

onBoardingQuestionnaireRouter.post("/", createOnBoardingQuestionnaire);

onBoardingQuestionnaireRouter.get("/", getOnBoardingQuestionnaire);

onBoardingQuestionnaireRouter.put("/:id", updateOnBoardingQuestionnaire);

onBoardingQuestionnaireRouter.delete("/:id", deleteOnBoardingQuestionnaire);

export default onBoardingQuestionnaireRouter