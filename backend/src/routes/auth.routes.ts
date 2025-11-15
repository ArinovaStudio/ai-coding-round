import express from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticate, getCurrentUser);

export default router;
