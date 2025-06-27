import express from 'express';
import { createMindfulResource, getMindfulResource, updateResource, deleteResource, recommendMindfulResource } from '../controllers/mindfulResourceController.js';

const resourceRouter = express.Router();

resourceRouter.post('/', createMindfulResource);
resourceRouter.get('/', getMindfulResource);

resourceRouter.get("/recommend/:id", recommendMindfulResource)

resourceRouter.delete('/:id', deleteResource);

resourceRouter.put("/:id", updateResource);



export default resourceRouter;