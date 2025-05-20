import express from "express";
import { createTestimonial, getTestimonial } from "../controllers/testimonialController.js";

const testimonialRouter = express.Router();

testimonialRouter.post("/", createTestimonial);
testimonialRouter.get("/", getTestimonial);

export default testimonialRouter;