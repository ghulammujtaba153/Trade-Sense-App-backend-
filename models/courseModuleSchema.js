
import mongoose from "mongoose";

const courseModuleSchema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
})


const CourseModule = mongoose.model("CourseModule", courseModuleSchema);
export default CourseModule