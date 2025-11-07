import mongoose, { Schema, Document } from "mongoose";

interface Question {
  question: string;
  answer: string;
}

export interface QuestionModel extends Document {
  interviewId: mongoose.Types.ObjectId;
  questions: Question[];
}

const QuestionSchema = new Schema<QuestionModel>(
  {
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
    },
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<QuestionModel>("Question", QuestionSchema);
