import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habbit",
    required: true,
  },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["completed", "missed"],
    required: true,
  },
});

const HabitLog = mongoose.model("HabitLog", habitLogSchema);

export default HabitLog;
