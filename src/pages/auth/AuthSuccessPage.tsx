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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        setStatus('loading');
        setMessage('Verifying your authentication...');

        // Wait for AuthContext to naturally refresh user data
        // The OAuth callback should have already set the cookie
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check if user data is available (AuthContext will handle the refresh)
        if (user) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          // Wait a bit to show success message
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Get the original path the user was trying to access
          const state = location.state as LocationState;
          const from = state?.from?.pathname || '/';

          // Redirect to the original path or home
          navigate(from, { replace: true });
        } else if (!loading) {
          // If not loading and no user, there was an error
          throw new Error('Authentication verification failed');
        }
        // If still loading, the effect will run again when loading changes

      } catch (error) {
        setStatus('error');
        setMessage('Authentication failed. Please try again.');

        // Redirect to login after showing error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleAuthSuccess();
  }, [user, loading, navigate, location.state]);

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
            padding: 2rem;
          }
          
          .auth-success-card {
            backdrop-filter: blur(10px);
            background-color: rgba(15, 15, 30, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
            padding: 3rem 2rem;
            width: 100%;
            max-width: 420px;
            text-align: center;
            transition: all 0.3s ease;
          }
          
          .auth-success-card:hover {
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
            border-color: rgba(255, 255, 255, 0.15);
            background-color: rgba(15, 15, 30, 0.35);
          }
          
          .status-icon {
            margin: 0 auto 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
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
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }
          
          .status-message {
            color: rgba(255, 255, 255, 0.7);
            font-size: 1rem;
            line-height: 1.5;
            margin-bottom: 2rem;
          }
          
          .progress-bar {
            width: 100%;
            height: 4px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 2rem;
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
            font-size: 0.875rem;
            font-weight: 500;
            padding: 0.75rem 1.5rem;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
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
            padding: 1rem;
            margin-bottom: 1.5rem;
          }
          
          .user-welcome-text {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.875rem;
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
              <Loader2 className="h-12 w-12 loading-spinner" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-12 w-12" />
            )}
            {status === 'error' && (
              <AlertCircle className="h-12 w-12" />
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
                  <AlertCircle className="h-4 w-4" />
                  <span>Back to Login</span>
                </>
              ) : (
                <>
                  <Home className="h-4 w-4" />
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