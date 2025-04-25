import express from 'express';
import { createEnrollment, getEnrollments, getEnrollmentsByCourse, getEnrollmentsByStudent } from '../controllers/enrollmentController.js';


const enrollmentRouter = express.Router();

enrollmentRouter.post('/', createEnrollment);

enrollmentRouter.get('/', getEnrollments);

enrollmentRouter.get('/:id', getEnrollmentsByStudent);

enrollmentRouter.get('/course/:id', getEnrollmentsByCourse);

export default enrollmentRouter;
