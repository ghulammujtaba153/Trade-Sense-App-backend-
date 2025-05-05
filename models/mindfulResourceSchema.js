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
  pillar: {
    type: String,
    enum: ['focus', 'stress relief', 'emotional resilience', 'performance optimization'],
    required: true
  },
  category: {
    type: String,
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
