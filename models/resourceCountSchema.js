import mongoose from "mongoose";

const resourceCountSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
    },
    resourceId: { 
        type: String,
        required: true
     },
    count: { 
        type: Number, 
        default: 1,
        required: true 
    },
  
}, { timestamps: true });

const ResourceCount = mongoose.model("ResourceCount", resourceCountSchema);

export default ResourceCount;
