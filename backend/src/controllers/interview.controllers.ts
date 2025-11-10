import { generateQuestionsWithGemini } from "../utils/aiClient";
import { Request, Response } from "express";
import Interview from "../models/interview";
import Question from "../models/question";
import Submission from "../models/submission";
import slugify from "slugify";
import { nanoid } from "nanoid";

// Create interview
export const createInterview = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Basic validation
    if (
      !data.name ||
      !data.appliedFor ||
      !Array.isArray(data.skillSet) ||
      !data.numberOfQuestions
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Generate a unique slug
    const slug =
      slugify(`${data.appliedFor}`, { lower: true, strict: true }) +
      "-" +
      nanoid(6);

    const createdBy = (req as any).user?._id ?? null;

    // Create the Interview document
    const interview = await Interview.create({
      name: data.name,
      appliedFor: data.appliedFor,
      description: data.description,
      difficultyLevel: data.difficultyLevel,
      skillSet: data.skillSet,
      focusStackArea: data.focusStackArea,
      numberOfQuestions: data.numberOfQuestions,
      slug,
      createdBy,
    });

    // Handle manually added questions
    let manualQuestions: any[] = [];
    if (Array.isArray(data.addQuestions) && data.addQuestions.length > 0) {
      manualQuestions = data.addQuestions.map((q: any) => ({
        question: q.question,
        answer: q.answer,
        questionType: q.questionType || "plainText",
        codeLang:
          q.questionType === "code" ? q.codeLang || "javascript" : undefined,
        options:
          q.questionType === "MCQ" && Array.isArray(q.options)
            ? q.options
            : undefined,
        isAI: false, // ✅ Mark manual questions as non-AI
      }));
    }

    // Determine how many AI questions to generate
    const remainingCount = data.numberOfQuestions - manualQuestions.length;
    let generatedQuestions: any[] = [];

    if (remainingCount > 0) {
      // Generate remaining AI questions
      generatedQuestions = await generateQuestionsWithGemini({
        skillSet: data.skillSet,
        focusStackArea: data.focusStackArea,
        difficultyLevel: data.difficultyLevel,
        numberOfQuestions: remainingCount,
        description: data.description,
      });

      // Normalize AI-generated question structure
      generatedQuestions = generatedQuestions.map((q: any) => ({
        question: q.question,
        answer: q.answer,
        questionType: q.questionType || "plainText",
        codeLang:
          q.questionType === "code" ? q.codeLang || "javascript" : undefined,
        options:
          q.questionType === "MCQ" && Array.isArray(q.options)
            ? q.options
            : undefined,
        isAI: true, // ✅ Mark AI-generated questions
      }));
    }

    // Combine manual + AI questions
    const allQuestions = [...manualQuestions, ...generatedQuestions];

    // Create Question document
    const questionDoc = await Question.create({
      interviewId: interview._id,
      questions: allQuestions,
    });

    // Link question document to interview
    interview.questionId = questionDoc._id as any;
    await interview.save();

    return res.status(201).json({
      success: true,
      message: "Interview created successfully",
      slug: interview.slug,
      interviewId: interview._id,
      questionId: questionDoc._id,
      totalQuestions: allQuestions.length,
      generatedByAI: remainingCount,
      manuallyAdded: manualQuestions.length,
    });
  } catch (err) {
    console.error("createInterview error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

// Get interview with questions by slug
export const getInterviewBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const interview = await Interview.findOne({ slug }).populate("questionId");

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    return res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

// Submit answer by the interviwee
export const submitInterview = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { candidateName, candidateEmail, responses } = req.body;

    if (!candidateName || !Array.isArray(responses)) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Find interview by slug
    const interview = await Interview.findOne({ slug });
    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    // Create new submission
    const submission = await Submission.create({
      interviewId: interview._id,
      candidateName,
      candidateEmail,
      responses,
    });

    return res.status(201).json({
      success: true,
      message: "Submission received successfully",
      submissionId: submission._id,
    });
  } catch (err) {
    console.error("submitInterview error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};
