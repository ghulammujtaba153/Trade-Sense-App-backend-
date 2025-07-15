import mongoos from "mongoose";

const moodSchema = new mongoos.Schema({
    userId: {
        type: mongoos.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mood: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Mood = mongoos.model("Mood", moodSchema);

export default Mood