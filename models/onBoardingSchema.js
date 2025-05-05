import mongoose from "mongoose";

const onBoardingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    questions: [
        {
            question: {
                type: String,
                required: true,
            },
            answer: {
                type: String,
                required: true,
            },
        },
    ],
});

const OnBoarding = mongoose.model(
    "onBoarding",
    onBoardingSchema
);

export default OnBoarding;