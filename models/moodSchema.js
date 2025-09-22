import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mood: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
});


const Mood = mongoose.model("Mood", moodSchema);

export default Mood