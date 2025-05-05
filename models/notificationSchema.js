import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  recipients: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'User',
    default: [], 
  },
  targetRoles: {
    type: [String], 
    default: [],
  },
  sendAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'failed'],
    default: 'scheduled',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  logs: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      delivered: {
        type: Boolean,
        default: false,
      },
      seen: {
        type: Boolean,
        default: false,
      },
      seenAt: Date,
    }
  ],
}, {
  timestamps: true, 
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
