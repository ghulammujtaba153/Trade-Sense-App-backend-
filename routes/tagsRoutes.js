import express from 'express';
import { createTags, deleteTag, getTags } from '../controllers/tagsController.js';


const tagsRouter = express.Router();

tagsRouter.post("/", createTags);

tagsRouter.delete("/:id", deleteTag);

tagsRouter.get("/", getTags);

export default tagsRouter;