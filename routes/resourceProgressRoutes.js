import express from 'express';
import { createProgress, getProgress } from '../controllers/resourceProgressController.js';

const ResourseProgressRouter = express.Router();

ResourseProgressRouter.post('/', createProgress);
ResourseProgressRouter.get('/:id', getProgress);



export default ResourseProgressRouter