import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface InterviewModel extends Document {
  questionId: Types.ObjectId;
  name: string;
  appliedFor: string;
  description?: string;
  difficultyLevel?: string;
  skillSet: string[];
  focusStackArea?: string;
  numberOfQuestions: number;
  slug: string;
  createdBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<InterviewModel>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
    name: { type: String, required: true },
    appliedFor: { type: String, required: true },
    description: { type: String },
    difficultyLevel: { type: String },
    skillSet: { type: [String], default: [] },
    focusStackArea: { type: String },
    numberOfQuestions: { type: Number, required: true },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default model<InterviewModel>("Interview", InterviewSchema);
