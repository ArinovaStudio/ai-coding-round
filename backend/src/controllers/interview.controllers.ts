import { generateQuestionsWithGemini } from "./../utils/aiClient";
import { Request, Response } from "express";
import Interview from "../models/interview";
import Question from "../models/question";
import slugify from "slugify";
import { nanoid } from "nanoid";

export const createInterview = async (req: Request, res: Response) => {
  try {
    const {
      name,
      appliedFor,
      description,
      difficultyLevel,
      skillSet,
      focusStackArea,
      numberOfQuestions,
      addQuestions,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !appliedFor ||
      !Array.isArray(skillSet) ||
      !numberOfQuestions
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const slug =
      slugify(`${appliedFor}`, { lower: true, strict: true }) + "-" + nanoid(6);
    const createdBy = (req as any).user?._id ?? null; // ensure auth middleware sets req.user

    const interview = await Interview.create({
      name,
      appliedFor,
      description,
      difficultyLevel,
      skillSet,
      focusStackArea,
      numberOfQuestions,
      slug,
      createdBy,
    });

    // Generate AI questions
    const generatedQuestions = await generateQuestionsWithGemini({
      skillSet,
      focusStackArea,
      difficultyLevel,
      numberOfQuestions,
      description,
    });

    // console.log("questions == ", generatedQuestions);

    const question = await Question.create({
      interviewId: interview._id,
      questions: generatedQuestions,
    });

    interview.questionId = question._id as any;
    await interview.save();

    return res.status(201).json({
      success: true,
      message: "Interview created successfully",
      slug: interview.slug,
      interviewId: interview._id,
      questionId: question._id,
    });
  } catch (err) {
    console.error("createInterview error:", err);

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
