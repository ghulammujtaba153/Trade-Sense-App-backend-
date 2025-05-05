import mongoose from "mongoose";

const onBoardingQuestionnaireSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
  },
});

const OnBoardingQuestionnaire = mongoose.model(
  "OnBoardingQuestionnaire",
  onBoardingQuestionnaireSchema
);

export default OnBoardingQuestionnaire;
