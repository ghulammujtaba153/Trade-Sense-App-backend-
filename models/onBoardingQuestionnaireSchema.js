import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const questionSchema = new Schema({
  image: {
    type: String,
    default: "", 
  },
  text: {
    type: String,
    required: true,
  },
});

const onBoardingQuestionnaireSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    images: {
      type: Boolean,
      required: true,
      default: true,
    },
    questions: [questionSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

// Avoid overwrite in dev/hot-reload
const OnBoardingQuestionnaire =
  models.OnBoardingQuestionnaire ||
  model("OnBoardingQuestionnaire", onBoardingQuestionnaireSchema);

export default OnBoardingQuestionnaire;
