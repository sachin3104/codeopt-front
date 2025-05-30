// File: src/components/PrivateRoute.tsx
// This component protects routes by redirecting unauthenticated users to /login

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking auth status, you can render a loader or null
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login, preserving the attempted path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authorized: render the child component
  return children;
};

export default PrivateRoute;
