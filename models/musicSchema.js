import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pillar: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    url:{
        type: String,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true,
    },
    duration:{
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})


const Music = mongoose.model("Music", musicSchema);


export default Music;