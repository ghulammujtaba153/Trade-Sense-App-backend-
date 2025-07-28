import express from 'express';
import { createCourseModule, deleteCourseModule, editCourseModule, getCourseModules } from '../controllers/courseModuleController.js';

const courseModuleRouter = express.Router();

courseModuleRouter.post('/', createCourseModule);
courseModuleRouter.get('/:id', getCourseModules);
courseModuleRouter.delete('/:id', deleteCourseModule);
courseModuleRouter.put('/:id', editCourseModule);

export default courseModuleRouter