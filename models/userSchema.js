import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    profilePic: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      minLength: 10,
      maxLength: 15
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male"
    },
    ageRange: {
      type: String,
      enum: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
      default: "18-24"
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user" , "admin", "editor"],
      default: "user"
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    goals:[
      {
        type: String,
      }
    ],
    choosenArea: [
      {
        type: String,
      }
    ],
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active"
    },
    isDeleted: {
      type: Boolean,
      default: false
    }

  }, {
    timestamps: true 
  }
);

const User = mongoose.model("User", userSchema);

export default User;

