import express  from 'express';
import { createDeliveredNotification, getDeliveredNotifications } from '../controllers/deliveredNotificationController.js';


const deliveredNotificationRouter = express.Router();

deliveredNotificationRouter.post('/', createDeliveredNotification);
deliveredNotificationRouter.get('/:id', getDeliveredNotifications);

export default deliveredNotificationRouter;