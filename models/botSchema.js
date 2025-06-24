import mongoose from 'mongoose'

const botSchema = new mongoose.Schema({
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
    }
})

const Bot = mongoose.model('Bot', botSchema);

export default Bot
