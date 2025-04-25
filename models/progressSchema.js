import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
    },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  completedModules: [{ type: Number }], // Indexes of completed modules
  completedAt: { 
    type: Date 
    },
  certificateIssued: { 
    type: Boolean, 
    default: false 
    },
});

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
