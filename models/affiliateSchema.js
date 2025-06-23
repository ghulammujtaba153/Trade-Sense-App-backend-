import mongoose from "mongoose"

const affiliateSchema = new mongoose.Schema({
    referrerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    visitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    type:{
        type: String,
        enum: ["visited", "enrolled"],
        required: true
    }
}, {
    timestamps: true
})

const Affiliate = mongoose.model("Affiliate", affiliateSchema);

export default Affiliate