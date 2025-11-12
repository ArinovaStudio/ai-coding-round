import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const InterviewPage = () => {
  const { slug } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [candidateInfo, setCandidateInfo] = useState({
    candidateName: '',
    candidateEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(true);

  useEffect(() => {
    if (slug) {
      // Check if interview is expired
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
        // Initialize responses array
        const initialResponses = response.data.data.questionId.questions.map(() => ({
          questionId: '',
          answer: ''
        }));
        setResponses(initialResponses);
      }
    } catch (error) {
      console.error('Error fetching interview:', error);
      toast.error('Interview not found or expired');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (value) => {
    const updatedResponses = [...responses];
    updatedResponses[currentQuestion] = {
      questionId: interview.questionId.questions[currentQuestion]._id,
      questionType: interview.questionId.questions[currentQuestion].questionType,
      answer: value
    };
    setResponses(updatedResponses);
  };

  const nextQuestion = () => {
    if (currentQuestion < interview.questionId.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
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
        responses: responses.filter(r => r.answer.trim())
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/${slug}/submit`,
        submissionData,
        { headers }
      );

      if (response.data.success) {
        setIsCompleted(true);
        toast.success("Interview submitted successfully!");
        
        // Mark interview as expired in localStorage
        localStorage.setItem(`interview_expired_${slug}`, 'true');
        
        // Redirect to homepage after 3 seconds
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800">⏳ Loading Interview...</h2>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Interview Not Found</h2>
          <p className="text-gray-600">The interview link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  if (showCandidateForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Interview</h2>
            <h3 className="text-lg text-blue-600 mb-4">{interview.name}</h3>
            <p className="text-gray-600">Position: {interview.appliedFor}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
              <input
                type="text"
                value={candidateInfo.candidateName}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, candidateName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Email *</label>
              <input
                type="email"
                value={candidateInfo.candidateEmail}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, candidateEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <button
              onClick={startInterview}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-green-50 p-8 rounded-lg shadow-lg max-w-md border border-green-200">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Interview Completed!</h2>
          <p className="text-green-700 mb-2">Thank you for taking the time to complete this interview.</p>
          <p className="text-green-700 mb-4">Your responses have been submitted successfully.</p>
          <p className="text-sm text-gray-600">Redirecting to homepage in 3 seconds...</p>
        </div>
      </div>
    );
  }

  const currentQ = interview.questionId.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / interview.questionId.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">{interview.name}</h1>
          <h2 className="text-lg opacity-90 mb-4">{interview.appliedFor}</h2>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mb-2">
            <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm opacity-90">Question {currentQuestion + 1} of {interview.questionId.questions.length}</p>
        </div>



        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              {currentQ.questionType}
            </span>
            {currentQ.codeLang && (
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                {currentQ.codeLang}
              </span>
            )}
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">{currentQ.question}</h3>

          <div>
            {currentQ.questionType === 'MCQ' && currentQ.options ? (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={option}
                      checked={responses[currentQuestion]?.answer === option}
                      onChange={(e) => handleResponseChange(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                value={responses[currentQuestion]?.answer || ''}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder="Type your answer here..."
                rows={currentQ.questionType === 'code' ? 10 : 5}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${currentQ.questionType === 'code' ? 'font-mono bg-gray-50' : ''
                  }`}
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {currentQuestion === interview.questionId.questions.length - 1 ? (
            <button
              onClick={submitInterview}
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Interview'}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;