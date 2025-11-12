import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const AuthGuard = ({ children, requiredRole = null }) => {
  const [auth] = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give time for auth context to load from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required
  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthGuard;