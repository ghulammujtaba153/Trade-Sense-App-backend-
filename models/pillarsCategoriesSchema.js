import mongoose from "mongoose";


const pillarsCategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        required:true
    },
    categories: {
        type: [String],
        required: true,
    },
});

const PillarsCategories = mongoose.model("PillarsCategories", pillarsCategoriesSchema);

export default PillarsCategories;