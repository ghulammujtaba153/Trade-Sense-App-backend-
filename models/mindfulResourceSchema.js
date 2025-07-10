import mongoose from "mongoose";

const mindfulResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description:{
    type: String,
    required: true,
  },
  thumbnail:{
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['audio', 'video'],
    required: true
  },
  pillar: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    
    default: []
  },
  url: {
    type: String,
    required: true
  },
  duration:{
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
