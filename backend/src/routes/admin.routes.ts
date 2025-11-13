import { Router } from "express";
import {
  createInterview,
  deleteQuestion,
  deleteUser,
  getAiQuestions,
  getAllUsers,
  getAllSubmissions,
  getSubmissionById,
  deleteSubmission,
  handleCandidateDecision,
  getAdminStats,
} from "../controllers/admin.controller";
import { authenticate, authorizeRoles } from "../middleware/auth";
const router = Router();

//route to create interview with questions
router.post(
  "/createInterview",
  authenticate,
  authorizeRoles("admin"),
  createInterview
);

//route to see all the ai generated questions
router.get(
  "/question/ai",
  authenticate,
  authorizeRoles("admin"),
  getAiQuestions
);

//route to delete a specific question
router.delete(
  "/question/:interviewId/:questionId",
  authenticate,
  authorizeRoles("admin"),
  deleteQuestion
);

//to see all the user
router.get("/users", authenticate, authorizeRoles("admin"), getAllUsers);

// to delete a specific user
router.delete("/users/:id", authenticate, authorizeRoles("admin"), deleteUser);

// to see all the interview submission
router.get(
  "/submission",
  authenticate,
  authorizeRoles("admin"),
  getAllSubmissions
);

//to see a specific submission
router.get(
  "/submission/:id",
  authenticate,
  authorizeRoles("admin"),
  getSubmissionById
);

//to delete a submission
router.delete(
  "/submission/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteSubmission
);

//decision - select or reject
router.post(
  "/submission/:id/decision",
  authenticate,
  authorizeRoles("admin"),
  handleCandidateDecision
);

//get admin dashboard statistics
router.get(
  "/stats",
  authenticate,
  authorizeRoles("admin"),
  getAdminStats
);

export default router;
