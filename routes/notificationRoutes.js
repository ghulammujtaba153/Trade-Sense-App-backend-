import express from "express";
import { createNotification, deleteNotification, updateNotification, getAllNotifications, getNotificationHistory, markNotificationAsSeen, getNotificationsByUserId } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/create", createNotification);
notificationRouter.get("/all", getAllNotifications);
notificationRouter.get("/history", getNotificationHistory);
notificationRouter.post("/seen/:id", markNotificationAsSeen);
notificationRouter.put("/:id", updateNotification);
notificationRouter.delete("/:id", deleteNotification)
notificationRouter.get("/:userId", getNotificationsByUserId);

export default notificationRouter;