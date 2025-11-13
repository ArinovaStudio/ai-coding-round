import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const SubmittedInterviews = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);


  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/submission`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSubmissions(response.data.submissions);
      }
    } catch (error) {
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = async (submission) => {
    setSelectedSubmission(submission);
    setLoadingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/submission/${submission._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSubmissionDetails(response.data.submission);
      }
    } catch (error) {
      toast.error('Failed to fetch submission details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedSubmission(null);
    setSubmissionDetails(null);
  };

  const handleCandidateDecision = async (submissionId, status) => {
    const candidate = selectedSubmission || submissions.find(s => s._id === submissionId);
    const actionText = status === 'selected' ? 'selecting' : 'rejecting';
    
    if (!window.confirm(`Are you sure you want to ${actionText.slice(0, -3)} ${candidate?.candidateName}? This will send an email notification.`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/submission/${submissionId}/decision`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const emailType = status === 'selected' ? 'selection' : 'rejection';
        toast.success(`✅ ${emailType.charAt(0).toUpperCase() + emailType.slice(1)} email sent to ${candidate?.candidateName}`);
        closeModal();
      }
    } catch (error) {
      toast.error('Failed to send email notification');
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/submission/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setSubmissions(submissions.filter(s => s._id !== submissionId));
          toast.success('Submission deleted successfully');
        }
      } catch (error) {
        toast.error('Failed to delete submission');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <h2>⏳ Loading submissions...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Submitted Interviews</h1>
        <p className="text-gray-600">Review candidate responses and evaluate performance</p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Submissions Yet</h3>
          <p className="text-gray-500">Candidate submissions will appear here once interviews are completed.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <h3 className="text-2xl font-bold text-blue-600">{submissions.length}</h3>
              <p className="text-gray-600 font-medium">Total Submissions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <h3 className="text-2xl font-bold text-green-600">{submissions.filter(s => new Date(s.createdAt) > new Date(Date.now() - 86400000)).length}</h3>
              <p className="text-gray-600 font-medium">Today</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
              <h3 className="text-2xl font-bold text-purple-600">{submissions.filter(s => new Date(s.createdAt) > new Date(Date.now() - 604800000)).length}</h3>
              <p className="text-gray-600 font-medium">This Week</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interview</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map(submission => (
                    <tr key={submission._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{submission.candidateName}</div>
                          <div className="text-sm text-gray-500">{submission.candidateEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {submission.interviewId?.appliedFor || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{submission.interviewId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(submission.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {submission.responses.length} answers
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewSubmission(submission)}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 mb-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          👁️ Open
                        </button>
                        <button
                          onClick={() => handleDeleteSubmission(submission._id)}
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
        </div>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">📋 Interview Submission</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{selectedSubmission.candidateName}</h4>
                  <p className="text-gray-600 mb-4">{selectedSubmission.candidateEmail}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      {selectedSubmission.interviewId?.appliedFor || 'N/A'}
                    </span>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                      {formatDate(selectedSubmission.createdAt)}
                    </span>
                  </div>
                </div>

                {loadingDetails ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Loading details...</p>
                  </div>
                ) : submissionDetails ? (
                  <div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Position</p>
                          <p className="font-medium">{submissionDetails.interviewId?.appliedFor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Submitted</p>
                          <p className="font-medium">{formatDate(submissionDetails.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 mb-4">📝 Question-wise Evaluation</h4>
                    <div className="space-y-4">
                      {submissionDetails.evaluatedResponses?.map((response, index) => (
                        <div key={index} className="border rounded-lg p-4 border-gray-200 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-semibold text-gray-800">Question {index + 1}</h5>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Question:</p>
                            <p className="text-gray-800 bg-white p-2 rounded border">{response.question}</p>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Candidate's Answer:</p>
                              <div className="bg-white p-2 rounded border">
                                {response.questionType === 'code' ? (
                                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                                    <code>{response.candidateAnswer || response.codeAnswer || 'No answer provided'}</code>
                                  </pre>
                                ) : (
                                  <p className="text-gray-800">{response.candidateAnswer || response.answer || 'No answer provided'}</p>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Expected Answer:</p>
                              <div className="bg-blue-50 p-2 rounded border border-blue-200">
                                {response.questionType === 'code' ? (
                                  <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                                    <code>{response.expectedAnswer}</code>
                                  </pre>
                                ) : (
                                  <p className="text-blue-800">{response.expectedAnswer}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {response.questionType === 'MCQ' && response.options && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Options:</p>
                              <div className="flex flex-wrap gap-2">
                                {response.options.map((option, optIndex) => (
                                  <span key={optIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                    {option}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Failed to load submission details
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button 
                  onClick={closeModal} 
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>

                <button 
                  onClick={() => handleCandidateDecision(selectedSubmission._id, 'selected')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  ✅ Select Candidate
                </button>
                <button 
                  onClick={() => handleCandidateDecision(selectedSubmission._id, 'rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  ❌ Reject Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default SubmittedInterviews;