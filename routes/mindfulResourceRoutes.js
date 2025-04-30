import express from 'express';
import { createMindfulResource, getMindfulResource, updateResource, deleteResource } from '../controllers/mindfulResourceController.js';

const resourceRouter = express.Router();

resourceRouter.post('/create', createMindfulResource);
resourceRouter.get('/', getMindfulResource);

resourceRouter.delete('/:id', deleteResource)

resourceRouter.put("/:id", updateResource)

export default resourceRouter;