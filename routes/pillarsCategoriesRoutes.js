import express from 'express';
import { createPillarsCategories, deletePillarsCategories, getAllCategories, getAllPillarsCategories, updatePillarsCategories } from '../controllers/pillarsCategoriesController.js';

const pillarsCategoriesRouter = express.Router();

pillarsCategoriesRouter.post("/", createPillarsCategories);
pillarsCategoriesRouter.get("/", getAllPillarsCategories);

pillarsCategoriesRouter.put("/:id", updatePillarsCategories);
pillarsCategoriesRouter.delete("/:id", deletePillarsCategories);

pillarsCategoriesRouter.get("/all", getAllCategories);

export default pillarsCategoriesRouter;

