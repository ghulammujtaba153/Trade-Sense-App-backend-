import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolledAt: { 
    type: Date, 
    default: Date.now 
},
status: {
  type: String,
  enum: ["active", "completed", "dropped"],
  default: "active",
},
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
