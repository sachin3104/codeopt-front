// File: src/routes/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Authentication pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import AuthSuccessPage from '@/pages/auth/AuthSuccessPage';

// Main pages
import NotFound from '@/pages/NotFound';

// Result pages
import AnalyseResult from '@/pages/results/AnalyseResult';
import OptimiseResult from '@/pages/results/OptimiseResult';
import ConvertResult from '@/pages/results/ConvertResult';
import DocumentResult from '@/pages/results/DocumentResult';

// Admin pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';

// Payment Routes
import PaymentSuccess from '@/pages/subscription/PaymentSuccess';
import PaymentCancel from '@/pages/subscription/PaymentCancel';
import SubscriptionPage from '@/pages/subscription/SubscriptionPage';

// Footer pages
import PricingPage from '@/pages/footer/PricingPage';
import ContactPage from '@/pages/footer/ContactPage';
import PrivacyPolicyPage from '@/pages/footer/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/footer/TermsOfServicePage';
import CookiePolicyPage from '@/pages/footer/CookiePolicyPage';

// OPTIMIZED: Import the optimized ConditionalHomeRoute component
import ConditionalHomeRoute from '@/routes/ConditionalHomeRoute';

const AppRoutes: React.FC = () => {
  console.log('🛣️ AppRoutes rendering...');
  
  return (
    <Routes>
      {/* Public authentication routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* OAuth callback route - public but handles authentication */}
      <Route path="/auth/success" element={<AuthSuccessPage />} />
      
      {/* Public footer pages */}
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/cookies" element={<CookiePolicyPage />} />
      
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
      
      {/* OPTIMIZED: Conditional home route using external component */}
      <Route path="/" element={<ConditionalHomeRoute />} />
      
      {/* Payment routes */}
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/subscription/success" element={<PaymentSuccess />} />
      <Route path="/subscription/cancel" element={<PaymentCancel />} />
      
      {/* Catch-all fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;