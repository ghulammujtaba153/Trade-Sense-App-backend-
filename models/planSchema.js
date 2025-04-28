import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["membership", "plans", "coupon"],
    required: true,
  },
  subCategory: {
    type: String,
    enum: ["monthly", "yearly"],
    required: true,
  },
  couponCode: {
    type: String,
    default: null, // Only applicable if category === 'coupon'
  },
  discountPercentage: {
    type: Number,
    default: null, // Only applicable if it's a coupon
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
