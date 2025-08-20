import express from "express";
import { assignInstructor, createCourse, deleteCourse, getAllCourses, getCourse, getCoursesByCreator, getCoursesByInstructor, updateCourse, updateCourseStatus } from "../controllers/courseController.js";
import authenticateToken from "../middleware/jwtMiddleware.js";

const courseRouter = express.Router();

courseRouter.post("/", createCourse);

courseRouter.get("/", getAllCourses);

courseRouter.post("/get", getCourse);

courseRouter.put("/:id", updateCourse);

courseRouter.delete("/:id", deleteCourse);

courseRouter.patch("/:id/status", updateCourseStatus);


courseRouter.get("/creator/:id", getCoursesByCreator);

courseRouter.get("/instructor/:id", getCoursesByInstructor);

courseRouter.patch("/instructor/:id", assignInstructor);

export default courseRouter;