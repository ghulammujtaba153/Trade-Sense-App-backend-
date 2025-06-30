import mongoose from 'mongoose'


const affiliateRequestsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, {
    timestamps: true
})

const AffiliateRequests = mongoose.model("AffiliateRequests", affiliateRequestsSchema);

export default AffiliateRequests
