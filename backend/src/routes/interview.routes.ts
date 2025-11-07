import  express from 'express';
import { createInterview } from '../controllers/interview.controllers';
const router = express.Router()

router.post("/createInterview",createInterview)

export default router