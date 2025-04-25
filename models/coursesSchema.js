import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    modules: [
        {
            title: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            videoUrl: {
                type: String,
                required: true
            }
        }
    ],
    isPremium: { type: Boolean, default: false },
    certificateAvailable: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['published', 'archived'],
        default: 'published'
    },
    isDeleted: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Course = mongoose.model('Course', courseSchema);

export default Course;