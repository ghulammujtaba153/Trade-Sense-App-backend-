import mongoose from "mongoose";


const welcomeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    features: [],
    showIcons: {
        type: Boolean,
        default: true
    }
})


const Welcome = mongoose.model("Welcome", welcomeSchema);

export default Welcome
