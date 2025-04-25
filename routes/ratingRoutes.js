import express from 'express';
import { createRatings, getRatingsByCourse } from '../controllers/ratingController.js';

const ratingRouter = express.Router();

ratingRouter.post("/", createRatings);
ratingRouter.get("/:id", getRatingsByCourse);

export default ratingRouter;