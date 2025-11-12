import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaClipboardList,
    FaUsers,
    FaQuestionCircle,
    FaChartLine,
    FaSpinner,
    FaCheck,
    FaTimes,
    FaClock,
    FaExclamationTriangle
} from 'react-icons/fa';

const InterviewStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock data for AI Interviewer
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setStats({
                totalInterviews: 1247,
                totalUsers: 892,
                totalQuestions: 156,
                avgScore: 78.5,
                interviewStats: {
                    pending: 23,
                    inProgress: 8,
                    completed: 1156,
                    cancelled: 60
                },
                topPerformers: [
                    { name: 'John Doe', position: 'Frontend Developer', score: 95 },
                    { name: 'Sarah Chen', position: 'Backend Developer', score: 92 },
                    { name: 'Mike Johnson', position: 'Full Stack Developer', score: 89 },
                    { name: 'Emily Davis', position: 'UI/UX Designer', score: 87 }
                ],
                recentInterviews: [
                    { id: '1', candidate: 'Alex Wilson', position: 'React Developer', status: 'Completed', date: '2024-01-15', score: 85 },
                    { id: '2', candidate: 'Lisa Brown', position: 'Node.js Developer', status: 'In Progress', date: '2024-01-15', score: null },
                    { id: '3', candidate: 'David Lee', position: 'Python Developer', status: 'Pending', date: '2024-01-14', score: null },
                    { id: '4', candidate: 'Maria Garcia', position: 'DevOps Engineer', status: 'Completed', date: '2024-01-14', score: 92 }
                ]
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading dashboard statistics...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="alert alert-danger" role="alert">
                <FaExclamationTriangle className="me-2" />
                Error loading dashboard statistics
            </div>
        );
    }

    return (
        <div className="dashboard-stats">
            {/* Summary Cards */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="card stat-card h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-primary-light">
                                    <FaClipboardList className="text-primary" />
                                </div>
                                <div className="ms-3">
                                    <h6 className="stat-label">Total Interviews</h6>
                                    <h3 className="stat-value">{stats.totalInterviews}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card stat-card h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-success-light">
                                    <FaChartLine className="text-success" />
                                </div>
                                <div className="ms-3">
                                    <h6 className="stat-label">Average Score</h6>
                                    <h3 className="stat-value">{stats.avgScore}%</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card stat-card h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-info-light">
                                    <FaUsers className="text-info" />
                                </div>
                                <div className="ms-3">
                                    <h6 className="stat-label">Total Candidates</h6>
                                    <h3 className="stat-value">{stats.totalUsers}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card stat-card h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="stat-icon bg-warning-light">
                                    <FaQuestionCircle className="text-warning" />
                                </div>
                                <div className="ms-3">
                                    <h6 className="stat-label">Question Bank</h6>
                                    <h3 className="stat-value">{stats.totalQuestions}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interview Status */}
            <div className="row mb-4">
                <div className="col-md-6 mb-4 mb-md-0">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Interview Status</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-3 col-6">
                                    <div className="order-status-box text-center  p-3">
                                        <div className="status-icon pending  mx-4 mb-5">
                                            <FaClock className="text-warning mx-3 "  />
                                        </div>
                                        <h4 className="status-count">{stats.interviewStats.pending}</h4>
                                        <p className="status-label">Pending</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6">
                                    <div className="order-status-box text-center p-3">
                                        <div className="status-icon processing mx-4 mb-5">
                                            <FaSpinner className="text-info mx-3" />
                                        </div>
                                        <h4 className="status-count">{stats.interviewStats.inProgress}</h4>
                                        <p className="status-label">In Progress</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6">
                                    <div className="order-status-box text-center p-3">
                                        <div className="status-icon approved mb-5 mx-4">
                                            <FaCheck className="text-success mx-3" />
                                        </div>
                                        <h4 className="status-count">{stats.interviewStats.completed}</h4>
                                        <p className="status-label">Completed</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-6">
                                    <div className="order-status-box text-center p-3">
                                        <div className="status-icon cancelled mb-5 mx-4">
                                            <FaTimes className="text-danger mx-3" />
                                        </div>
                                        <h4 className="status-count">{stats.interviewStats.cancelled}</h4>
                                        <p className="status-label">Cancelled</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">Top Performers</h5>
                            <Link to="/admin/submitted-interviews" className="btn btn-sm btn-outline-primary">View All</Link>
                        </div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                {stats.topPerformers.map((performer, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1">{performer.name}</h6>
                                            <p className="text-muted mb-0">{performer.position}</p>
                                        </div>
                                        <span className="badge bg-success">
                                            {performer.score}%
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Interviews */}
            <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Recent Interviews</h5>
                    <Link to="/admin/submitted-interviews" className="btn btn-sm btn-outline-primary">View All</Link>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Interview ID</th>
                                    <th>Candidate</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentInterviews.map(interview => (
                                    <tr key={interview.id}>
                                        <td>#{interview.id.padStart(8, '0')}</td>
                                        <td>{interview.candidate}</td>
                                        <td>{interview.position}</td>
                                        <td>
                                            <span className={`badge bg-${
                                                interview.status === 'Pending' ? 'warning' :
                                                interview.status === 'In Progress' ? 'info' :
                                                interview.status === 'Completed' ? 'success' : 'danger'
                                            }`}>
                                                {interview.status}
                                            </span>
                                        </td>
                                        <td>{new Date(interview.date).toLocaleDateString()}</td>
                                        <td>{interview.score ? `${interview.score}%` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewStats;