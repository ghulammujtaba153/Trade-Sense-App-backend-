import express from 'express';
import { createMindfulResource, getMindfulResource } from '../controllers/mindfulResourceController.js';

const resourceRouter = express.Router();

resourceRouter.post('/create', createMindfulResource);
resourceRouter.get('/get', getMindfulResource);

export default resourceRouter;