import mongoose from "mongoose";

const mindfulResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['audio', 'video'],
    required: true
  },
  category: {
    type: String,
    enum: ['meditation', 'motivation', 'affirmation', 'breathing', 'focus', 'stress-relief'],
    required: true
  },
  tags: {
    type: [String],
    enum: [
      'relaxation',
      'confidence',
      'mindfulness',
      'energy boost',
      'focus',
      'calm',
      'anxiety relief',
      'daily ritual',
      'positivity'
    ],
    default: []
  },
  url: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MindfulResource = mongoose.model("MindfulResource", mindfulResourceSchema);

export default MindfulResource;
