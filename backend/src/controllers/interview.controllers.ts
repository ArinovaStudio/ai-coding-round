import { generateQuestionsWithGemini } from "../utils/aiClient";
import { Request, Response } from "express";
import Interview from "../models/interview";
import Question from "../models/question";
import slugify from "slugify";
import { nanoid } from "nanoid";

export const createInterview = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    //Basic validation
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

    const slug =
      slugify(`${data.appliedFor}`, { lower: true, strict: true }) + "-" + nanoid(6);
    const createdBy = (req as any).user?._id ?? null;

    //Create the Interview
    const interview = await Interview.create({
      name:data.name,
      appliedFor:data.appliedFor,
      description:data.description,
      difficultyLevel:data.difficultyLevel,
      skillSet:data.skillSet,
      focusStackArea:data.focusStackArea,
      numberOfQuestions:data.numberOfQuestions,
      slug,
      createdBy,
    });

    //Handle manually added questions
    const manualQuestions = Array.isArray(data.addQuestions)
      ? data.addQuestions.map((q: any) => ({
          question: q.question,
          answer: q.answer,
          questionType: q.questionType || "plainText",
          codeLang:
            q.questionType === "code" ? q.codeLang || "javascript" : undefined,
        }))
      : [];

    //Determine how many AI questions are needed
    const remainingCount = data.numberOfQuestions - manualQuestions.length;

    let generatedQuestions: any[] = [];

    if (remainingCount > 0) {
      //Generate remaining AI questions
      generatedQuestions = await generateQuestionsWithGemini({
        skillSet:data.skillSet,
        focusStackArea:data.focusStackArea,
        difficultyLevel:data.difficultyLevel,
        numberOfQuestions: remainingCount,
        description:data.description,
      });

      //Normalize structure of AI-generated questions
      generatedQuestions = generatedQuestions.map((q: any) => ({
        question: q.question,
        answer: q.answer,
        questionType: q.questionType || "plainText",
        codeLang:
          q.questionType === "code" ? q.codeLang || "javascript" : undefined,
      }));
    }

    //Combine manual + AI questions
    const allQuestions = [...manualQuestions, ...generatedQuestions];

    //Create Question document
    const questionDoc = await Question.create({
      interviewId: interview._id,
      questions: allQuestions,
    });

    //Save the question id in interview
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
      .json({ success: false, message: "Internal Server Error" });
  }
};
