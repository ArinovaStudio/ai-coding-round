import mongoose, { Schema, Document } from "mongoose";

interface ResponseItem {
  questionId: mongoose.Types.ObjectId;
  questionType: string;
  answer?: string;
  codeAnswer?: string;
  codeLang?: string;
}

export interface SubmissionModel extends Document {
  interviewId: mongoose.Types.ObjectId;
  candidateName: string;
  candidateEmail?: string;
  responses: ResponseItem[];
  submittedAt: Date;
}

const SubmissionSchema = new Schema<SubmissionModel>(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", required: true },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String },
    responses: [
      {
        questionId: { type: Schema.Types.ObjectId, required: true },
        questionType: { type: String, enum: ["plainText", "code", "MCQ"], required: true },
        answer: String,
        codeAnswer: String,
        codeLang: String,
      },
    ],
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<SubmissionModel>("Submission", SubmissionSchema);
