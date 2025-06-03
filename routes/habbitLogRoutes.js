import express from 'express';
import { createHabitLog } from '../controllers/habitLogController.js';


const habitLogRouter = express.Router();

habitLogRouter.post('/', createHabitLog);

export default habitLogRouter;
