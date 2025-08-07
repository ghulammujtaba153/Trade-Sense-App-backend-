import express from 'express';
import { createSubscription, getSubscriptions } from '../controllers/subscriptionController.js';

const subscriptionRouter = express.Router();



subscriptionRouter.post("/", createSubscription);
subscriptionRouter.get("/:id", getSubscriptions);

export default subscriptionRouter;