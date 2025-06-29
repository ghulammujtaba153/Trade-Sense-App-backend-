import mongoose from 'mongoose'

const botSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    createdAt: {
    type: Date,
    default: Date.now
    }
})

const Bot = mongoose.model('Bot', botSchema);

export default Bot
