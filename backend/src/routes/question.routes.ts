import { Router } from "express";
import {
  deleteQuestion,
  getAiQuestions,
} from "../controllers/question.controller";
const router = Router();

router.get("/question/ai", getAiQuestions);
router.delete("/question/:interviewId/:questionId", deleteQuestion);

export default router;
