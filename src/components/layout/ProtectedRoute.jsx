import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../ui/Loader';

export function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  // If AuthContext is still loading initially (if we add global loading state),
  // we could return <PageLoader /> here. Assuming currentUser is null when unauthenticated.
  // The AuthContext currently sets loading to false when checked.
  
  if (currentUser === undefined) {
    return <PageLoader />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in but hasn't completed onboarding, enforce onboarding
  if (!currentUser.completedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user completed onboarding and tries to access onboarding, redirect to team builder
  if (currentUser.completedOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/team-builder" replace />;
  }

  return children;
}
