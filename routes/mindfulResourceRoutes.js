import express from 'express';
import { createMindfulResource, getMindfulResource, updateResource, deleteResource, recommendMindfulResource, bundleResources, RandomOneAudioOneVideoResource, getDailyThought, topPickResource } from '../controllers/mindfulResourceController.js';

const resourceRouter = express.Router();

resourceRouter.post('/', createMindfulResource);
resourceRouter.get('/', getMindfulResource);

resourceRouter.get("/recommend/:id", recommendMindfulResource)


resourceRouter.get("/top/picks/:id", topPickResource)

resourceRouter.delete('/:id', deleteResource);

resourceRouter.put("/:id", updateResource);


resourceRouter.get("/bundle/:id", bundleResources)   


resourceRouter.get("/random/:id", RandomOneAudioOneVideoResource)

resourceRouter.get("/dailyThought", getDailyThought)


export default resourceRouter;