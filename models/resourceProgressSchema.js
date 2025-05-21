import mongoose from "mongoose";

const resourceProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, 
    resourceId: {
        type: String,
        required: true
    }, 
    currentTime: {
        type: Number,
        required: true
    }
})

const ResourceProgress = mongoose.model("ResourceProgress", resourceProgressSchema);

export default ResourceProgress