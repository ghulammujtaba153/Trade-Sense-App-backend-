import mongoose from "mongoose";

const platformSchema = new mongoose.Schema({
  type: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const livestreamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  platform: { type: [platformSchema], required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Livestream", livestreamSchema);
