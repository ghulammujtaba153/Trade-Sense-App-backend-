import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["subscription", "affiliate", "other"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;