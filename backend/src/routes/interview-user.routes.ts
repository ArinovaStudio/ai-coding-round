import { Router } from "express";
import {
  getInterviewBySlug,
  submitInterview,
} from "../controllers/interview-user.controller";
const router = Router();

router.get("/:slug", getInterviewBySlug);
router.post("/:slug/submit", submitInterview);

export default router;
