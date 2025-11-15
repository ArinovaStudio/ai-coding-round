import { useEffect, useState } from "react";
import QuestionPanel from "./QuestionPanel";
import CodeEditor from "./CodeEditor";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/auth";

export default function Index() {
  const { slug } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [codeAnswers, setCodeAnswers] = useState([]);
  const [textAnswers, setTextAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth, login] = useAuth();
  const location = useLocation();
  const question = interview?.questionId?.questions[currentQuestion];

  const handleCodeAnswer = (code) => {
    const updatedCodeAnswers = [...codeAnswers];
    updatedCodeAnswers[currentQuestion] = code;
    setCodeAnswers(updatedCodeAnswers);

    const updatedResponses = [...responses];
    updatedResponses[currentQuestion] = {
      questionId: interview.questionId.questions[currentQuestion]._id,
      questionType: interview.questionId.questions[currentQuestion].questionType,
      answer: code
    };
    setResponses(updatedResponses);
  };

  const handleTextAnswer = (text) => {
    const updatedTextAnswers = [...textAnswers];
    updatedTextAnswers[currentQuestion] = text;
    setTextAnswers(updatedTextAnswers);

    if (question?.questionType !== 'code') {
      const updatedResponses = [...responses];
      updatedResponses[currentQuestion] = {
        questionId: interview.questionId.questions[currentQuestion]._id,
        questionType: interview.questionId.questions[currentQuestion].questionType,
        answer: text
      };
      setResponses(updatedResponses);
    }
  };

  const handleNext = () => {
    if (currentQuestion < interview.questionId.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitInterview();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitInterview = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const submissionData = {
        candidateName: currentUser?.username || '',
        candidateEmail: currentUser?.email || '',
        responses: responses.filter(r => r.answer && r.answer.trim())
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/${slug}/submit`,
        submissionData,
        { headers }
      );

      if (response.data.success) {
        setIsCompleted(true);
        toast.success("Interview submitted successfully!");
        localStorage.setItem(`interview_expired_${slug}`, 'true');
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting interview:", error);
      toast.error("Failed to submit interview. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };



  // Fetch current logged-in user details
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setIsLoggedIn(true);
        setCurrentUser(response.data.user);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    if (slug) {
      const isExpired = localStorage.getItem(`interview_expired_${slug}`);
      if (isExpired) {
        window.location.href = '/';
        return;
      }
      fetchCurrentUser(); // Fetch user first
      fetchInterview();
    }
  }, [slug]);

  const fetchInterview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${slug}`, { headers });

      if (response.data.success) {
        setInterview(response.data.data);
        const initialResponses = response.data.data.questionId.questions.map(() => ({
          questionId: '',
          answer: ''
        }));
        setResponses(initialResponses);
        setCodeAnswers(new Array(response.data.data.questionId.questions.length).fill(''));
        setTextAnswers(new Array(response.data.data.questionId.questions.length).fill(''));
      }
    } catch (error) {
      console.error('Error fetching interview:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-white">⏳ Loading Interview...</h2>
        </div>
      </div>
    );
  }
  if (!isLoggedIn || !interview) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center bg-[#2a2a2a] p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-red-400 mb-2">Login Required</h2>
          <p className="text-gray-400">Please login to access this interview.</p>
          <button
            onClick={() => navigate("/login", { state: { from: location } })}
            className="w-full py-3 mt-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }



  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center bg-[#2a2a2a] p-8 rounded-lg shadow-lg max-w-md border border-green-500">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-semibold text-green-400 mb-4">Interview Completed!</h2>
          <p className="text-gray-300 mb-2">Thank you for taking the time to complete this interview.</p>
          <p className="text-gray-300 mb-4">Your responses have been submitted successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to homepage in 3 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Left side - Monaco Editor (only for code questions) */}
      {question?.questionType === 'code' && (
        <div className="w-full md:w-1/2 min-h-96 md:h-screen bg-[#1e1e1e] border-r border-[#3a3a3a] flex flex-col">
          <div className="bg-[#1f1f1f] border-b border-[#3a3a3a] px-4 py-3 flex items-center gap-2 md:gap-3">
            <span className="text-xs md:text-sm text-gray-300 font-medium">
              Code Editor - {question?.codeLang || 'JavaScript'}
            </span>
          </div>
          <div className="flex-1 p-4">
            <CodeEditor
              codeLang={question?.codeLang || 'javascript'}
              code={codeAnswers[currentQuestion] || ''}
              setCode={handleCodeAnswer}
            />
          </div>
        </div>
      )}

      {/* Right side - Question Panel */}
      <div className={`w-full ${question?.questionType === 'code' ? 'md:w-1/2' : ''}`}>
        <QuestionPanel
          question={question}
          answer={textAnswers[currentQuestion] || ""}
          onAnswer={handleTextAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentIndex={currentQuestion}
          totalQuestions={interview?.questionId?.questions?.length || 0}
          isLastQuestion={currentQuestion === (interview?.questionId?.questions?.length || 0) - 1}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}