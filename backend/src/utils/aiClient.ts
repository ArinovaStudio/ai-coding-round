import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

interface GenerateParams {
  skillSet: string[];
  focusStackArea: string;
  difficultyLevel: string;
  numberOfQuestions: number;
  description?: string;
}

/**
 * Generates interview questions and answers using Gemini 2.5 Flash
 */
export const generateQuestionsWithGemini = async ({
  skillSet,
  focusStackArea,
  difficultyLevel,
  numberOfQuestions,
  description,
}: GenerateParams) => {
  // 🧠 Prompt
  const prompt = `
  You are an AI interviewer. Generate ${numberOfQuestions} ${difficultyLevel}-level interview questions multiple choice based with four options
  and their correct answers for a candidate applying for a ${focusStackArea} role.
  The required skills are: ${skillSet.join(", ")}.
  ${description ? `Interview description: ${description}` : ""}

  Format the response strictly in JSON as:
  [
    { "question": "string", "answer": "string" },
    ...
  ]
    Do not include markdown, explanations, or code fences.
  `;

  // Call Gemini model
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: prompt,
  });
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleanText = text
    ?.replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  //   console.log("response====", text);
  try {
    // Attempt to parse Gemini's JSON output
    const parsed = JSON.parse(cleanText as string);
    return parsed;
  } catch (err) {
    console.error("⚠️ Gemini output was not valid JSON:\n", err);
    return [];
  }
};
