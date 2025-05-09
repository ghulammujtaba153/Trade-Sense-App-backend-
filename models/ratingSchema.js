
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course", 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;