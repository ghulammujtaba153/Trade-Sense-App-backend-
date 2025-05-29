import express from "express";
import { addTestimonial, createTestimonial, deleteTestimonial, getTestimonial, updateTestimonial } from "../controllers/testimonialController.js";

const testimonialRouter = express.Router();

testimonialRouter.post("/", createTestimonial);
testimonialRouter.get("/", getTestimonial);
testimonialRouter.post("/user", addTestimonial);
testimonialRouter.put("/:id", updateTestimonial);
testimonialRouter.delete("/:id", deleteTestimonial);


export default testimonialRouter;