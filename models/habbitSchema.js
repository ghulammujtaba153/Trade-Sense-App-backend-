import mongoose from "mongoose";

const habbitSchema = new mongoose.Schema({
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
    completedDates: {
        type: [Date],
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
        enum: [ "pending","completed", "failed"],
        default: "pending",
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

const Habbit = mongoose.model("Habbit", habbitSchema);

export default Habbit;
