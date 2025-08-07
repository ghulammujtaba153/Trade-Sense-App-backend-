import express from 'express';
import { createDeleteRequest, getDeleteRequest, getDeleteRequests } from '../controllers/deleteRequestController.js';


const deleteRequstRouter = express.Router();


deleteRequstRouter.post("/", createDeleteRequest)

deleteRequstRouter.get("/:id", getDeleteRequest)


deleteRequstRouter.get("/", getDeleteRequests)

export default deleteRequstRouter;

