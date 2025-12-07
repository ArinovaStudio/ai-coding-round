import React from 'react';
import InterviewStats from '../../components/InterviewStats';
import { useAuth } from '../../context/auth';

const AdminDashboardNew = () => {
    const { auth } = useAuth();

    const capitalizeWords = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const name = capitalizeWords(auth?.user?.name);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {name || 'Admin'}</h2>
                    <p className="text-gray-600">Here's what's happening with your AI Interviewer platform today.</p>
                </div>
                <InterviewStats />
            </div>
        </div>
    );
};

export default AdminDashboardNew;