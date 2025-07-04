// src/pages/AuthSuccessPage.tsx
// OPTIMIZED VERSION - Uses new auth context

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, Home } from 'lucide-react';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const AuthSuccessPage: React.FC = () => {
  const { user, loading, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        setStatus('loading');
        setMessage('Verifying your authentication...');

        // Try to refresh user data multiple times with exponential backoff
        let attempts = 0;
        const maxAttempts = 5;
        let authenticated = false;
        
        while (attempts < maxAttempts && !authenticated) {
          // Wait with exponential backoff
          const delay = Math.min(1000 * Math.pow(1.5, attempts), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Try to refresh user data
          authenticated = await refreshUser();
          attempts++;
          
          if (authenticated) {
            break;
          }
        }

        if (authenticated) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          // Wait a bit to show success message
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Check for stored redirect path
          const redirectPath = sessionStorage.getItem('authRedirect');
          sessionStorage.removeItem('authRedirect');
          
          // Redirect to stored path or home
          const destination = redirectPath || '/';
          navigate(destination, { replace: true });
        } else {
          throw new Error('Authentication verification failed');
        }

      } catch (error) {
        console.error('Auth success error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');

        // Redirect to login after showing error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    // Only run if we're not already authenticated
    if (!user || !isAuthenticated) {
      handleAuthSuccess();
    } else {
      // If already authenticated, redirect immediately
      setStatus('success');
      const redirectPath = sessionStorage.getItem('authRedirect');
      sessionStorage.removeItem('authRedirect');
      navigate(redirectPath || '/', { replace: true });
    }
  }, [navigate, user, isAuthenticated, refreshUser]); // Add back the dependencies

  // Manual redirect function for error state
  const handleRedirect = () => {
    if (status === 'error') {
      navigate('/login', { replace: true });
    } else if (status === 'success' && user) {
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <div className="auth-success-container">
        <style>{`
          .auth-success-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 1rem;
          }
          
          @media (min-width: 640px) {
            .auth-success-container {
              padding: 2rem;
            }
          }
          
          .auth-success-card {
            backdrop-filter: blur(10px);
            background-color: rgba(15, 15, 30, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
            padding: 2rem 1.5rem;
            width: 100%;
            max-width: 420px;
            text-align: center;
            transition: all 0.3s ease;
          }
          
          @media (min-width: 640px) {
            .auth-success-card {
              border-radius: 16px;
              padding: 3rem 2rem;
            }
          }
          
          .auth-success-card:hover {
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
            border-color: rgba(255, 255, 255, 0.15);
            background-color: rgba(15, 15, 30, 0.35);
          }
          
          .status-icon {
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          @media (min-width: 640px) {
            .status-icon {
              margin-bottom: 1.5rem;
            }
          }
          
          .status-icon.loading {
            color: rgba(99, 102, 241, 0.8);
          }
          
          .status-icon.success {
            color: rgba(52, 211, 153, 0.9);
          }
          
          .status-icon.error {
            color: rgba(239, 68, 68, 0.9);
          }
          
          .loading-spinner {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .status-title {
            color: rgba(255, 255, 255, 0.95);
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }
          
          @media (min-width: 640px) {
            .status-title {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }
          }
          
          .status-message {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.875rem;
            line-height: 1.5;
            margin-bottom: 1.5rem;
          }
          
          @media (min-width: 640px) {
            .status-message {
              font-size: 1rem;
              margin-bottom: 2rem;
            }
          }
          
          .progress-bar {
            width: 100%;
            height: 3px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 1.5rem;
          }
          
          @media (min-width: 640px) {
            .progress-bar {
              height: 4px;
              margin-bottom: 2rem;
            }
          }
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.6), rgba(79, 70, 229, 0.8));
            border-radius: 2px;
            transition: width 0.3s ease;
          }
          
          .progress-fill.loading {
            width: 60%;
            animation: pulse 2s ease-in-out infinite;
          }
          
          .progress-fill.success {
            width: 100%;
            background: linear-gradient(90deg, rgba(52, 211, 153, 0.6), rgba(16, 185, 129, 0.8));
          }
          
          .progress-fill.error {
            width: 100%;
            background: linear-gradient(90deg, rgba(239, 68, 68, 0.6), rgba(220, 38, 38, 0.8));
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          
          .redirect-button {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(79, 70, 229, 0.6));
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-size: 0.75rem;
            font-weight: 500;
            padding: 0.625rem 1.25rem;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            text-decoration: none;
          }
          
          @media (min-width: 640px) {
            .redirect-button {
              font-size: 0.875rem;
              padding: 0.75rem 1.5rem;
              gap: 0.5rem;
            }
          }
          
          .redirect-button:hover {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(79, 70, 229, 0.7));
            border-color: rgba(99, 102, 241, 0.4);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .redirect-button.error {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.6), rgba(220, 38, 38, 0.6));
            border-color: rgba(239, 68, 68, 0.3);
          }
          
          .redirect-button.error:hover {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.7), rgba(220, 38, 38, 0.7));
            border-color: rgba(239, 68, 68, 0.4);
          }
          
          .user-welcome {
            background-color: rgba(52, 211, 153, 0.1);
            border: 1px solid rgba(52, 211, 153, 0.2);
            border-radius: 8px;
            padding: 0.75rem;
            margin-bottom: 1rem;
          }
          
          @media (min-width: 640px) {
            .user-welcome {
              padding: 1rem;
              margin-bottom: 1.5rem;
            }
          }
          
          .user-welcome-text {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.75rem;
          }
          
          @media (min-width: 640px) {
            .user-welcome-text {
              font-size: 0.875rem;
            }
          }
          
          .user-name {
            color: rgba(52, 211, 153, 0.9);
            font-weight: 600;
          }
        `}</style>
        
        <div className="auth-success-card">
          {/* Status Icon */}
          <div className={`status-icon ${status}`}>
            {status === 'loading' && (
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 loading-spinner" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12" />
            )}
            {status === 'error' && (
              <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12" />
            )}
          </div>
          
          {/* Status Title */}
          <h2 className="status-title">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Welcome!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>
          
          {/* User Welcome Message for Success */}
          {status === 'success' && user && (
            <div className="user-welcome">
              <div className="user-welcome-text">
                Welcome back, <span className="user-name">
                  {user.first_name || user.username}
                </span>!
              </div>
            </div>
          )}
          
          {/* Status Message */}
          <p className="status-message">{message}</p>
          
          {/* Progress Bar */}
          <div className="progress-bar">
            <div className={`progress-fill ${status}`}></div>
          </div>
          
          {/* Manual Redirect Button (shows after error or for manual control) */}
          {(status === 'error' || (status === 'success' && user)) && (
            <button 
              onClick={handleRedirect}
              className={`redirect-button ${status}`}
            >
              {status === 'error' ? (
                <>
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Back to Login</span>
                </>
              ) : (
                <>
                  <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Go to Dashboard</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthSuccessPage;