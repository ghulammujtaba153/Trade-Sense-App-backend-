import mongoose from "mongoose";

const goalsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "daily",
    },
    targetDate: {
        type: Date,
        required: true,
    },
    reminders: {
        enabled: {
            type: Boolean,
            default: false,
        },
        time: {
            type: Date,
        },
    },
    status: {
        type: String,
        enum: ["active", "completed", "dropped"],
        default: "active",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Goals = mongoose.model("Goals", goalsSchema);

export default Goals;
