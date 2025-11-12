import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const SavedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewQuestion, setPreviewQuestion] = useState(null);

  useEffect(() => {
    fetchAiQuestions();
  }, []);

  const fetchAiQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/question/ai`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Flatten questions from all interviews
        const allQuestions = [];
        response.data.data.forEach(doc => {
          doc.questions.forEach(q => {
            allQuestions.push({
              id: q._id,
              question: q.question,
              answer: q.answer,
              questionType: q.questionType,
              codeLang: q.codeLang,
              options: q.options,
              interviewId: doc.interviewId._id,
              interviewName: doc.interviewId.name,
              appliedFor: doc.interviewId.appliedFor
            });
          });
        });
        setQuestions(allQuestions);
      }
    } catch (error) {
      console.error('Error fetching AI questions:', error);
      toast.error('Failed to load AI questions');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (question) => {
    setPreviewQuestion(question);
  };

  const handleDelete = async (questionId, interviewId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/question/${interviewId}/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setQuestions(questions.filter(q => q.id !== questionId));
        toast.success('Question deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const closePreview = () => {
    setPreviewQuestion(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🤖 AI Generated Questions</h1>
        <p className="text-gray-600">Manage and review AI-generated interview questions</p>
      </div>
      
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <p className="text-lg font-medium text-gray-700">Total AI Questions: <span className="text-blue-600">{questions.length}</span></p>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={fetchAiQuestions}
          disabled={loading}
        >
          {loading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">⏳ Loading AI questions...</p>
          </div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No AI Questions Found</h3>
          <p className="text-gray-500">No AI-generated questions found. Create some interviews first!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interview</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map(question => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                      {question.question.length > 80 
                        ? `${question.question.substring(0, 80)}...` 
                        : question.question
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {question.questionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {question.interviewName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {question.appliedFor}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handlePreview(question)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 mb-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        👁️ Preview
                      </button>
                      <button 
                        onClick={() => handleDelete(question.id, question.interviewId)}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {previewQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">📋 Question Preview</h3>
                <button 
                  onClick={closePreview}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {previewQuestion.questionType}
                  </span>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                    {previewQuestion.interviewName} - {previewQuestion.appliedFor}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Question:</h4>
                  <p className="text-gray-700 leading-relaxed">{previewQuestion.question}</p>
                </div>
                
                {previewQuestion.answer && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Expected Answer:</h4>
                    <p className="text-green-700 leading-relaxed">{previewQuestion.answer}</p>
                  </div>
                )}
                
                {previewQuestion.options && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Options:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {previewQuestion.options.map((option, index) => (
                        <li key={index} className="text-blue-700">{option}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {previewQuestion.codeLang && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <span className="font-semibold text-purple-800">Programming Language: </span>
                    <span className="text-purple-700">{previewQuestion.codeLang}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button 
                  onClick={closePreview} 
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  ✏️ Edit Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedQuestions;