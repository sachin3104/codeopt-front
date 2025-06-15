// File: src/App.tsx
// Updated to include conditional routing and result page routes
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CodeProvider } from '@/context/CodeContext';

// Authentication
import { AuthProvider, useAuth } from '@/context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AuthSuccessPage from './pages/auth/AuthSuccessPage';

// Main pages
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

// Result pages
import AnalyseResult from './pages/results/AnalyseResult';
import OptimiseResult from './pages/results/OptimiseResult';
import ConvertResult from './pages/results/ConvertResult';
import DocumentResult from './pages/results/DocumentResult';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

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

  // If user is logged in, show HomePage
  if (user) {
    return <HomePage />;
  }

  // If user is not logged in, show LandingPage
  return <LandingPage />;
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <CodeProvider>
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
              
              {/* Protected result routes */}
              <Route
                path="/results/analyze"
                element={
                  <PrivateRoute>
                    <AnalyseResult />
                  </PrivateRoute>
                }
              />
              <Route
                path="/results/optimize"
                element={
                  <PrivateRoute>
                    <OptimiseResult />
                  </PrivateRoute>
                }
              />
              <Route
                path="/results/convert"
                element={
                  <PrivateRoute>
                    <ConvertResult />
                  </PrivateRoute>
                }
              />
              <Route
                path="/results/document"
                element={
                  <PrivateRoute>
                    <DocumentResult />
                  </PrivateRoute>
                }
              />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              
              {/* Conditional home route - Landing page or HomePage based on auth */}
              <Route path="/" element={<ConditionalHomeRoute />} />
              
              {/* Catch-all fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </CodeProvider>
  </QueryClientProvider>
);

export default App;