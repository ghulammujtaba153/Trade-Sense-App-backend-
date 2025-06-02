import express from 'express';
import { createCourseModule, deleteCourseModule, getCourseModules } from '../controllers/courseModuleController.js';

const courseModuleRouter = express.Router();

courseModuleRouter.post('/', createCourseModule);
courseModuleRouter.get('/:id', getCourseModules);
courseModuleRouter.delete('/:id', deleteCourseModule);

export default courseModuleRouter