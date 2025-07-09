import express from 'express';
import { createHabitLog, getHabbitLogs } from '../controllers/habitLogController.js';


const habitLogRouter = express.Router();

habitLogRouter.post('/', createHabitLog);

habitLogRouter.get('/:id', getHabbitLogs);

export default habitLogRouter;
