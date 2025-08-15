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
      // enum: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
      default: "18-24"
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    isPremium: {
      type: Boolean,
      default: false
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
    isAffiliate:{
      type: Boolean,
      default: false
    },
    affiliateCode:{
      type: String,
      default: null
    },
    goals:[],
    onboarding:[],
    questionnaireAnswers: {
      type: Map,
      of: [String],
      default: {}
    },
    categories: {
      type: [String],
      default: []
    },
    isGoogleUse:{
      type: Boolean,
      default: false
    },
    googleId: {
      type: String
    },
    fcmToken: {},
    description: {type: String},
    links: { },
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

