import express from 'express';
import { cancelSubscription, createSubscription, getSubscriptions } from '../controllers/subscriptionController.js';

const subscriptionRouter = express.Router();



subscriptionRouter.post("/", createSubscription);
subscriptionRouter.get("/:id", getSubscriptions);
subscriptionRouter.put("/cancel/:id", cancelSubscription);

export default subscriptionRouter;