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

//Generates interview questions and answers using gemini-2.0-flash-lite

export const generateQuestionsWithGemini = async ({
  skillSet,
  focusStackArea,
  difficultyLevel,
  numberOfQuestions,
  description,
}: GenerateParams) => {
  //Prompt
  const prompt = `
You are an AI interviewer. Generate ${numberOfQuestions} ${difficultyLevel}-level interview questions 
for a candidate applying for a ${focusStackArea} role.

Required skills: ${skillSet.join(", ")}.
${description ? `Interview description: ${description}` : ""}

Each question should include:
- question: the question text
- answer: the correct answer or expected response
- questionType: one of "MCQ", "plainText", or "code"
- If questionType is "MCQ", include 4 options in an array named "options"
- If questionType is "code", include a field "codeLang" (like "javascript", "python", "c++") and the question should ask for code or output
- If questionType is "plainText", it should be a conceptual or theory-based question

Format the response strictly in JSON as:
[
  {
    "question": "string",
    "answer": "string",
    "questionType": "MCQ" | "plainText" | "code",
    "options": ["A", "B", "C", "D"], // only for MCQ
    "codeLang": "string" // only if questionType is "code"
  },
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
  try {
    // Attempt to parse Gemini's JSON output
    const parsed = JSON.parse(cleanText as string);
    return parsed;
  } catch (err) {
    console.error("⚠️ Gemini output was not valid JSON:\n", err);
    return [];
  }
};
