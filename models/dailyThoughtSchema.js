import mongoose from "mongoose";


const dailyThoughtSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    audio: {
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})


const DailyThought = mongoose.model("DailyThought", dailyThoughtSchema);


export default DailyThought;