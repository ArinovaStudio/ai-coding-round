import mongoose, { Schema, Document } from "mongoose";

interface Question {
  question: string;
  answer: string;
  questionType: "code" | "plainText" | "MCQ";
  codeLang?: string;
  options?: string[];
  isAI: boolean;
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
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        questionType: {
          type: String,
          enum: ["code", "plainText", "MCQ"],
          default: "plainText",
          required: true,
        },
        codeLang: { type: String },
        options: [{ type: String }],
        isAI: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<QuestionModel>("Question", QuestionSchema);
