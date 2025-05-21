import express from 'express';
import { createProgress, getProgress, updateProgress } from '../controllers/resourceProgressController.js';

const ResourseProgressRouter = express.Router();

ResourseProgressRouter.post('/', createProgress);
ResourseProgressRouter.get('/', getProgress);
ResourseProgressRouter.put("/", updateProgress)


export default ResourseProgressRouter