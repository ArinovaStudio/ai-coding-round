import { Router } from "express";
import {
  getInterviewBySlug,
  submitInterview,
} from "../controllers/user.controller";
import { authenticate, authorizeRoles } from "../middleware/auth";
const router = Router();

router.get(
  "/:slug",
  authenticate,
  authorizeRoles("user", "admin"),
  getInterviewBySlug
);
router.post(
  "/:slug/submit",
  authenticate,
  authorizeRoles("user"),
  submitInterview
);

export default router;
