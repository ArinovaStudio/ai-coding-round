import { Router } from "express";
import {
  createInterview,
  getInterviewBySlug,
  submitInterview,
} from "../controllers/interview.controllers";
const router = Router();

router.post("/createInterview", createInterview);
router.get("/:slug", getInterviewBySlug);
router.post("/:slug/submit", submitInterview);

export default router;
