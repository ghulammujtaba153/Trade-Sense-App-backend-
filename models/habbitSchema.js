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
    type: {
        type: String,
        required: true,
    },
    targetDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: [ "active", "pending", "completed"],
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
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

const Habbit = mongoose.model("Habbit", habbitSchema);

export default Habbit;
