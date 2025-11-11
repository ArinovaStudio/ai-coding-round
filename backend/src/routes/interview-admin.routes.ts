import { Router } from "express";
import {
  createInterview,
  deleteQuestion,
  getAiQuestions
} from "../controllers/interview-admin.controllers";
const router = Router();

router.post("/createInterview", createInterview);
router.get("/question/ai", getAiQuestions);
router.delete("/question/:interviewId/:questionId", deleteQuestion);




export default router;
