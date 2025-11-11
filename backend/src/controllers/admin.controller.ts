import { generateQuestionsWithGemini } from "../utils/aiClient";
import { Request, Response } from "express";
import Interview from "../models/interview";
import Question from "../models/question";
import User from "../models/auth";
import Submission from "../models/submission";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { sendEmail } from "../utils/sendEmail";

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

// get all ai questions
export const getAiQuestions = async (req: Request, res: Response) => {
  try {
    const docs = await Question.find({ "questions.isAI": true }).populate(
      "interviewId",
      "name slug appliedFor"
    );

    const aiQuestions = docs
      .map((doc) => ({
        ...doc.toObject(),
        questions: doc.questions.filter((q) => q.isAI === true),
      }))
      .filter((doc) => doc.questions.length > 0);

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

// delete a specific question
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

// get all user
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "user" }, "-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch users", error });
  }
};

// delete a specfific user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete user", error });
  }
};

//Get all submissions
export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find()
      .populate("interviewId", "name appliedFor")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch submissions", error });
  }
};

//Get single submission by ID
export const getSubmissionById = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.id).populate(
      "interviewId",
      "name appliedFor description"
    );

    if (!submission)
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });

    res.status(200).json({ success: true, submission });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch submission", error });
  }
};

//Delete submission
export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);

    if (!submission)
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });

    res
      .status(200)
      .json({ success: true, message: "Submission deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete submission", error });
  }
};

//Select / Reject candidate + send email
export const handleCandidateDecision = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // "selected" or "rejected"
    const submission = await Submission.findById(req.params.id);

    if (!submission)
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });

    if (!submission.candidateEmail)
      return res
        .status(400)
        .json({ success: false, message: "Candidate email not provided" });

    let subject = "";
    let message = "";

    if (status === "selected") {
      subject = "🎉 Congratulations! You've been selected";
      message = `
        <h3>Dear ${submission.candidateName},</h3>
        <p>We’re excited to inform you that you’ve been <b>selected</b> for the next round of the interview process.</p>
        <p>Our team will contact you shortly for the next steps.</p>
        <p>Best regards,<br>Recruitment Team</p>
      `;
    } else if (status === "rejected") {
      subject = "Interview Update – Thank You for Applying";
      message = `
        <h3>Dear ${submission.candidateName},</h3>
        <p>Thank you for participating in the interview process. After careful consideration, we regret to inform you that you have not been selected at this time.</p>
        <p>We encourage you to apply again in the future. Wishing you the best in your career journey.</p>
        <p>Best regards,<br>Recruitment Team</p>
      `;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    await sendEmail(submission.candidateEmail, subject, message);

    res.status(200).json({
      success: true,
      message: `Candidate ${status} and email sent.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update candidate status",
      error,
    });
  }
};
