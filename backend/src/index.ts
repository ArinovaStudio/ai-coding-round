import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoute from "./routes/auth.routes"
import interviewAdminRoute from "./routes/admin.routes"
import interviewUserRoute from "./routes/user.routes"

const app = express();
const PORT = process.env.PORT;

//connect db
connectDB();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cors())

app.use("/api/auth",authRoute)
app.use("/api/admin",interviewAdminRoute)
app.use("/api/user",interviewUserRoute)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
