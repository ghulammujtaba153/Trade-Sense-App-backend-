import mongoose from "mongoose";

const onBoardingQuestionnaireSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["goals", "chosen-area"],
    required: true
  },
  image:{
    type: String
  },
  text: {
    type: String,
    required: true,
  },
});

const OnBoardingQuestionnaire = mongoose.model(
  "OnBoardingQuestionnaire",
  onBoardingQuestionnaireSchema
);

export default OnBoardingQuestionnaire;
