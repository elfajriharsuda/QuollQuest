import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, session } = useAuth();
  const location = useLocation();

  // Add session validation
  useEffect(() => {
    if (!loading && !user && !session) {
      console.log('No valid session found, redirecting to login');
    }
  }, [user, session, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Check both user and session for better reliability
  if (!user || !session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;