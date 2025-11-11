import { Request, Response } from "express";
import Submission from "../models/submission";
import Question from "../models/question";
import Interview from "../models/interview";


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
