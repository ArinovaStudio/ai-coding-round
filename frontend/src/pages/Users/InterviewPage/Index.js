import { useEffect, useState } from "react";
import QuestionPanel from "./QuestionPanel";
import CodeEditor from "./CodeEditor";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Index() {
  const { slug } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [codeAnswers, setCodeAnswers] = useState([]);
  const [textAnswers, setTextAnswers] = useState([]);
  const [candidateInfo, setCandidateInfo] = useState({
    candidateName: '',
    candidateEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(true);

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
        candidateName: candidateInfo.candidateName,
        candidateEmail: candidateInfo.candidateEmail,
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

  const startInterview = () => {
    if (!candidateInfo.candidateName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!candidateInfo.candidateEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setShowCandidateForm(false);
  };

  useEffect(() => {
    if (slug) {
      const isExpired = localStorage.getItem(`interview_expired_${slug}`);
      if (isExpired) {
        window.location.href = '/';
        return;
      }
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
      toast.error('Interview not found or expired');
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

  if (!interview) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center bg-[#2a2a2a] p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-red-400 mb-2">Interview Not Found</h2>
          <p className="text-gray-400">The interview link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  if (showCandidateForm) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center py-8">
        <div className="max-w-md w-full bg-[#2a2a2a] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Interview</h2>
            <h3 className="text-lg text-orange-400 mb-4">{interview.name}</h3>
            <p className="text-gray-400">Position: {interview.appliedFor}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
              <input
                type="text"
                value={candidateInfo.candidateName}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, candidateName: e.target.value })}
                className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Email *</label>
              <input
                type="email"
                value={candidateInfo.candidateEmail}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, candidateEmail: e.target.value })}
                className="w-full px-4 py-2 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                placeholder="Enter your email address"
              />
            </div>

            <button
              onClick={startInterview}
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Start Interview
            </button>
          </div>
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
      {/* Left side - Monaco Editor */}
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
      
      {/* Right side - Question Panel */}
      <div className="w-full md:w-1/2">
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
          showCodeEditor={question?.questionType === 'code'}
        />
      </div>
    </div>
  );
}
