import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    plan: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
    }],
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
    isPremium: { type: Boolean, default: false },
    certificateAvailable: { type: Boolean, default: false },
    price:{
        type: Number,
        default: 0
    },
    duration:{
        type: Number,
        default: 0
    },
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