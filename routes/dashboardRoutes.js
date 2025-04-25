import express from "express";
import { getAdminDashboardInfo, getEnrollmentGrowth, getRatings, getUserGrowth } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/", getAdminDashboardInfo);

dashboardRouter.get("/user/growth", getUserGrowth);

dashboardRouter.get("/ratings", getRatings);

dashboardRouter.get("/enrollments/growth", getEnrollmentGrowth);

export default dashboardRouter;