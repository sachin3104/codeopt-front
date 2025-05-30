// File: src/App.tsx
// Updated to include conditional routing and result page routes
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Authentication
import { AuthProvider, useAuth } from '@/context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthSuccessPage from './pages/AuthSuccessPage';

// Main pages
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

// Result pages
import AnalyzeResultPage from './pages/results/AnalyzeResultPage';
import OptimizeResultPage from './pages/results/OptimizeResultPage';
import ConvertResultPage from './pages/results/ConvertResultPage';
import DocumentResultPage from './pages/results/DocumentResultPage';

const queryClient = new QueryClient();

// Component to handle conditional home route
const ConditionalHomeRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loading spinner while checking auth status
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // If user is logged in, show Index (main app)
  if (user) {
    return <Index />;
  }

  // If user is not logged in, show LandingPage
  return <LandingPage />;
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public authentication routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* OAuth callback route - public but handles authentication */}
            <Route path="/auth/success" element={<AuthSuccessPage />} />
            
            {/* Conditional home route - Landing page or Index based on auth */}
            <Route path="/" element={<ConditionalHomeRoute />} />
            
            {/* Protected result routes */}
            <Route
              path="/results/analyze"
              element={
                <PrivateRoute>
                  <AnalyzeResultPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/results/optimize"
              element={
                <PrivateRoute>
                  <OptimizeResultPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/results/convert"
              element={
                <PrivateRoute>
                  <ConvertResultPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/results/document"
              element={
                <PrivateRoute>
                  <DocumentResultPage />
                </PrivateRoute>
              }
            />
            
            {/* Redirect /home to / for consistency */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            {/* Catch-all fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;