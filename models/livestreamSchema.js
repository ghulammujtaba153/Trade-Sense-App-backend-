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
  tags: { type: Array, default: [] },
  thumbnail: { type: String , required: true },
  sendNotification : { type: Array, default: [] },
  // Track which notification labels were already sent
  sentNotifications: { type: [
    new mongoose.Schema({
      label: { type: String, required: true },
      sentAt: { type: Date, default: Date.now }
    }, { _id: false })
  ], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Livestream", livestreamSchema);
