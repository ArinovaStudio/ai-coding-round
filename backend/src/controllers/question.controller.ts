import { Request, Response } from "express";
import Question from "../models/question";

export const getAiQuestions = async (req: Request, res: Response) => {
  try {
    const docs = await Question.find({ "questions.isAI": true })
      .populate("interviewId", "name slug appliedFor");

    const aiQuestions = docs
      .map(doc => ({
        ...doc.toObject(),
        questions: doc.questions.filter(q => q.isAI === true),
      }))
      .filter(doc => doc.questions.length > 0); 

    if (!aiQuestions.length) {
      return res
        .status(404)
        .json({ success: false, message: "No AI-generated questions found" });
    }

    return res.status(200).json({
      success: true,
      count: aiQuestions.length,
      data: aiQuestions,
    });
  } catch (err) {
    console.error("getAiQuestions error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { interviewId, questionId } = req.params;

    const questionDoc = await Question.findOne({ interviewId });
    if (!questionDoc)
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });

    questionDoc.questions = questionDoc.questions.filter(
      (q: any) => q._id.toString() !== questionId
    );

    await questionDoc.save();

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (err) {
    console.error("deleteQuestion error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
  }
};
