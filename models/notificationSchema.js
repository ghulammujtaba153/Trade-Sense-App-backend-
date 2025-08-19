import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
    trim: true,
  },
  targetType: {
    type: String,
    enum: ["all", "specific", "roles"],
    default: "all",
  },
  recipients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  targetRoles: [
    {
      type: String, 
      enum: ["admin", "user", "editor"],
    },
  ],
  sendType: {
    type: String,
    enum: ["now", "scheduled"],
    default: "now",
  },
  sendAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  seen: [],
  status: {
    type: String,
    enum: ["sent", "scheduled"],
    default: "scheduled",
  },
}, {
  timestamps: true,
});

export default mongoose.model("Notification", notificationSchema);
