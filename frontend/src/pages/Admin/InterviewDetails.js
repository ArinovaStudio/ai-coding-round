import React from 'react';
import { useParams, Link } from 'react-router-dom';

const InterviewDetails = () => {
  const { id } = useParams();
  
  // Mock interview data
  const interview = {
    id: id,
    candidate: 'John Doe',
    position: 'Frontend Developer',
    status: 'Completed',
    submittedAt: '2024-01-15',
    score: 85,
    duration: '45 minutes',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    experience: '3 years',
    questions: [
      {
        question: 'What is React and how does it work?',
        answer: 'React is a JavaScript library for building user interfaces...',
        score: 9
      },
      {
        question: 'Explain the difference between let, const, and var.',
        answer: 'let and const are block-scoped while var is function-scoped...',
        score: 8
      },
      {
        question: 'What are React hooks?',
        answer: 'Hooks are functions that let you use state and other React features...',
        score: 9
      }
    ]
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">📋 Interview Details</h2>
          <Link to="/admin/submitted-interviews" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            ← Back to Interviews
          </Link>
        </div>

        {/* Candidate Info */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h5 className="text-lg font-semibold text-gray-800">👤 Candidate Information</h5>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-gray-700"><span className="font-semibold">Name:</span> {interview.candidate}</p>
                <p className="text-gray-700"><span className="font-semibold">Email:</span> {interview.email}</p>
                <p className="text-gray-700"><span className="font-semibold">Phone:</span> {interview.phone}</p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700"><span className="font-semibold">Position:</span> {interview.position}</p>
                <p className="text-gray-700"><span className="font-semibold">Experience:</span> {interview.experience}</p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    interview.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {interview.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Summary */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h5 className="text-lg font-semibold text-gray-800">📈 Interview Summary</h5>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-600">{interview.score}%</h3>
                <p className="text-gray-500">Overall Score</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-cyan-600">{interview.duration}</h3>
                <p className="text-gray-500">Duration</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-green-600">{interview.questions.length}</h3>
                <p className="text-gray-500">Questions</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-orange-600">{interview.submittedAt}</h3>
                <p className="text-gray-500">Submitted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions & Answers */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h5 className="text-lg font-semibold text-gray-800">❓ Questions & Answers</h5>
          </div>
          <div className="p-6 space-y-4">
            {interview.questions.map((qa, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h6 className="text-blue-600 font-semibold">Question {index + 1}</h6>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {qa.score}/10
                  </span>
                </div>
                <p className="font-semibold text-gray-800 mb-2">{qa.question}</p>
                <p className="text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-blue-500">{qa.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            ✅ Select Candidate
          </button>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            ❌ Reject Candidate
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            📄 Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;