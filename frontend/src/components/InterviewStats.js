import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaClipboardList,
    FaUsers,
    FaQuestionCircle,
    FaSpinner,
    FaCheck,
    FaTimes,
    FaClock,
    FaExclamationTriangle
} from 'react-icons/fa';
import { REACT_APP_API_URL } from '../context/env';

const InterviewStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch dynamic data from backend
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${REACT_APP_API_URL}/api/admin/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data.stats);
                } else {
                    console.error('Failed to fetch stats');
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
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
                <div className="col-xl-4 col-md-6">
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

                <div className="col-xl-4 col-md-6">
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
                <div className="col-xl-4 col-md-6">
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
                <div className="col-xl-6 col-md-12  mb-4 mb-md-0">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Interview Status</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-3 col-6">
                                    <div className="order-status-box text-center  p-3">
                                        <div className="status-icon pending  mx-4 mb-5">
                                            <FaClock className="text-warning mx-3 " />
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
                    <div className="table-responsive px-3">
                        <table className="table table-hover ">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentInterviews.map(interview => (
                                    <tr key={interview.id}>
                                        <td>{interview.candidate}</td>
                                        <td>{interview.position}</td>
                                        <td>
                                            <span className={`badge bg-${interview.status === 'Pending' ? 'warning' :
                                                    interview.status === 'In Progress' ? 'info' :
                                                        interview.status === 'Completed' ? 'success' : 'danger'
                                                }`}>
                                                {interview.status}
                                            </span>
                                        </td>
                                        <td>{new Date(interview.date).toLocaleDateString()}</td>
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