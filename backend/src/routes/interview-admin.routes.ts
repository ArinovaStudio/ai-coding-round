import { Router } from "express";
import {
  createInterview,
  deleteQuestion,
  getAiQuestions,
} from "../controllers/interview-admin.controllers";
import { authenticate, authorizeRoles } from "../middleware/auth";
const router = Router();

router.post(
  "/createInterview",
  authenticate,
  authorizeRoles("admin"),
  createInterview
);
router.get(
  "/question/ai",
  authenticate,
  authorizeRoles("admin"),
  getAiQuestions
);
router.delete(
  "/question/:interviewId/:questionId",
  authenticate,
  authorizeRoles("admin"),
  deleteQuestion
);

export default router;
