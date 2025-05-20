import mongoose from "mongoose";

const termsConditionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

const TermsCondition = mongoose.model("TermsCondition", termsConditionSchema);

export default TermsCondition;