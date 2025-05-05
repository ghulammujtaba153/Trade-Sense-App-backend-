import express from "express"
import { createOnboarding, getOnboarding } from "../controllers/onboardingController.js";

const onBoardingRouter = express.Router();

onBoardingRouter.post("/", createOnboarding);
onBoardingRouter.get("/:id", getOnboarding);


export default onBoardingRouter;