import mongoose from "mongoose";

const appConfigSchema = new mongoose.Schema({
  theme: {
    type: String, 
    required: true,
    enum: ["dark", "light"],
    default: "dark",
  },
  goalImages: {
    type: Boolean, 
    required: true,
    default: false,
  },
  areaImages: {
    type: Boolean,
    required: true,
  },
});


const AppConfig = mongoose.models.AppConfig || mongoose.model("AppConfig", appConfigSchema);

export default AppConfig;
