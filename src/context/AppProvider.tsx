import React, { ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { SubscriptionProvider } from './SubscriptionContext';

// Wrapper component that only renders children when authenticated
const AuthenticatedContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Main AppProvider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AuthenticatedContent>
        <SubscriptionProvider>
          {children}
        </SubscriptionProvider>
      </AuthenticatedContent>
    </AuthProvider>
  );
}; 