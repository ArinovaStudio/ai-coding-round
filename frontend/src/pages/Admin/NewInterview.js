import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const NewInterviewPro = () => {
  const [formData, setFormData] = useState({
    name: '',
    appliedFor: '',
    description: '',
    difficultyLevel: 'Medium',
    skillSet: '',
    focusStackArea: '',
    numberOfQuestions: 5,
    addQuestions: [{ question: '', answer: '' }]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const questions = [...formData.addQuestions];
    questions[index][field] = value;
    setFormData({ ...formData, addQuestions: questions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      addQuestions: [...formData.addQuestions, { question: '', answer: '' }]
    });
  };

  const removeQuestion = (index) => {
    const questions = formData.addQuestions.filter((_, i) => i !== index);
    setFormData({ ...formData, addQuestions: questions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const skillSetArray = formData.skillSet ? formData.skillSet.split(',').map(skill => skill.trim()).filter(skill => skill) : [];

      const interviewData = {
        name: formData.name,
        appliedFor: formData.appliedFor,
        description: formData.description,
        difficultyLevel: formData.difficultyLevel,
        skillSet: skillSetArray,
        focusStackArea: formData.focusStackArea || 'General',
        numberOfQuestions: parseInt(formData.numberOfQuestions),
        addQuestions: formData.addQuestions.filter(q => q.question.trim())
      };

      if (skillSetArray.length === 0) {
        toast.error('Please add at least one skill');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/createInterview`, interviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setGeneratedSlug(response.data.slug);
        toast.success('🎉 Interview created successfully!');
      } else {
        toast.error('Failed to create interview');
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error('Error creating interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 Create New Interview</h1>
        <p className="text-gray-600">Design a comprehensive interview experience with AI-powered questions</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📋 Interview Configuration</h2>
            <p className="text-gray-600">Set up the basic parameters for your interview session</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">👤 Candidate Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter candidate's full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">💼 Position Applied For</label>
              <input
                type="text"
                name="appliedFor"
                value={formData.appliedFor}
                onChange={handleChange}
                placeholder="e.g., Senior Frontend Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">📝 Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Provide a detailed job description to help AI generate relevant questions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">⚡ Difficulty Level</label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Easy">🟢 Easy - Entry Level</option>
                <option value="Medium">🟡 Medium - Mid Level</option>
                <option value="Hard">🔴 Hard - Senior Level</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🔢 Number of Questions</label>
              <input
                type="number"
                name="numberOfQuestions"
                value={formData.numberOfQuestions}
                onChange={handleChange}
                min="1"
                max="50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🛠️ Required Skills</label>
              <input
                type="text"
                name="skillSet"
                value={formData.skillSet}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, AWS"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Separate multiple skills with commas</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Focus Area</label>
              <input
                type="text"
                name="focusStackArea"
                value={formData.focusStackArea}
                onChange={handleChange}
                placeholder="Frontend, Backend, Full Stack, DevOps"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">❓ Custom Questions</h2>
            <p className="text-gray-600">Add specific questions you want to include in the interview</p>
          </div>

          <div className="space-y-6">
            {formData.addQuestions.map((q, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-800">Question {index + 1}</h4>
                  {formData.addQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                    <textarea
                      value={q.question}
                      onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                      placeholder="Enter your custom question here..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Answer (Optional)</label>
                    <textarea
                      value={q.answer}
                      onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                      placeholder="Provide the ideal answer or key points..."
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              ➕ Add Another Question
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Creating...' : '🚀 Create Interview'}
          </button>
        </div>
      </form>

      {generatedSlug && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Interview Created Successfully!</h3>
            <p className="text-green-700">Your interview is ready. Share this link with the candidate:</p>
          </div>

          <div className="bg-white border border-green-300 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm text-gray-700 break-all">
                http://localhost:3000/interview/{generatedSlug}
              </div>
              <button
                onClick={() => { copyToClipboard(`http://localhost:3000/interview/${generatedSlug}`);  }}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                📋 Copy Link
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">Next Steps:</h4>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                Send the interview link to the candidate
              </li>
              <li className="flex items-center">
                <span className="mr-2">📧</span>
                Set up email notifications for completion
              </li>
              <li className="flex items-center">
                <span className="mr-2">📊</span>
                Monitor progress in the submissions dashboard
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewInterviewPro;