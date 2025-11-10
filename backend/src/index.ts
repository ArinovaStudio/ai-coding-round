import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import interviewRoute from "./routes/interview.routes"
import questionRoute from "./routes/question.routes"

const app = express();
const PORT = process.env.PORT;

//connect db
connectDB();

app.use(express.json());

app.use("/api/admin",interviewRoute)
app.use("/api/admin",questionRoute)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
