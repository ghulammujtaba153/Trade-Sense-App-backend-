import express from "express";
import { createCourse, deleteCourse, getAllCourses, getCourse, getCoursesByCreator, updateCourse, updateCourseStatus } from "../controllers/courseController.js";
import authenticateToken from "../middleware/jwtMiddleware.js";

const courseRouter = express.Router();

courseRouter.post("/", createCourse);

courseRouter.get("/", authenticateToken, getAllCourses);

courseRouter.get("/:id", getCourse);

courseRouter.put("/:id", updateCourse);

courseRouter.delete("/:id", deleteCourse);

courseRouter.patch("/:id/status", updateCourseStatus);


courseRouter.get("/creator/:id", getCoursesByCreator);

export default courseRouter;