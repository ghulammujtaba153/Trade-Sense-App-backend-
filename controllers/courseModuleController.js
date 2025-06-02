import CourseModule from "../models/courseModuleSchema.js";


export const createCourseModule = async (req, res) => {
    try {
        const newCourseModule = await CourseModule.create(req.body);
        res.status(201).json(newCourseModule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getCourseModules = async (req, res) => {
    const { id } = req.params;
    try {
        const courseModules = await CourseModule.find({courseID: id});
        res.status(200).json(courseModules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const  deleteCourseModule = async (req, res) => {
    const { id } = req.params;
    try {
        const courseModule = await CourseModule.findByIdAndDelete(id);
        res.status(200).json(courseModule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
