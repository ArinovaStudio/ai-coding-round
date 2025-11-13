import { useEffect, useState } from "react";
import QuestionPanel from "./QuestionPanel";
import axios from "axios";

/*const questions = [
  {
    id: 1,
    question: "How browser runs?",
    type: "text",
    hint: "TYPE YOUR ANSWER",
  },
  {
    id: 2,
    question: "Write a for loop to print pyramid.",
    type: "code",
    hint: "WRITE THE CODE",
  },
  {
    id: 3,
    question: "Choose What is the use of nodemailer?",
    type: "choice",
    options: [
      "It is used to send mails",
      "Its an npm package used to create servers",
      "This is an JavaScript framework used to build ui",
      "This is an vulnerability scanner.",
    ],
    correctAnswer: 0,
  },
];*/

interface Question {
  _id: string;
  question: string;
  answer: string;
  questionType: "code" | "plainText" | "MCQ";
  codeLang?: string;
  options?: string[];
  isAI: boolean;
}

export default function Index() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  const question = questions[currentQuestion];
  // const progress = `${currentQuestion + 1}/${questions.length}`;

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  useEffect(() => {
    const fetchQuestionsbySlug = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token = ", token);

        const { data } = await axios.get(
          "http://localhost:3000/api/user/machine-learning-engineer-fTaWjc",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestions(data?.data?.questionId?.questions || []);
        console.log("data = ", data?.data?.questionId?.questions);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchQuestionsbySlug();
  }, []);

  useEffect(() => {
    console.log("questions = ", questions);
  }, [questions]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 min-h-96 md:h-screen bg-[#2a2a2a] border-r border-b md:border-b-0 border-[#3a3a3a] flex flex-col">
        <div className="bg-[#1f1f1f] border-b border-[#3a3a3a] px-4 py-3 flex items-center gap-2 md:gap-3 flex-wrap md:flex-nowrap">
          <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
          </div>
          <span className="text-xs md:text-sm text-gray-300 font-medium">
            Arinova Studio
          </span>
          <div className="flex-1 hidden md:block" />
          <div className="text-xs text-gray-400 flex items-center gap-1 md:gap-4">
            <span className="hidden sm:inline">00:00</span>
            <span className="hidden sm:inline">10:00 - 5:54</span>
            <span className="hidden md:inline">Typescript v</span>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <QuestionPanel
          question={question}
          answer={answers[currentQuestion] || ""}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onSkip={handleSkip}
          currentIndex={currentQuestion}
          totalQuestions={questions.length}
        />
      </div>
    </div>
  );
}
