import React, { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
// import BeamsBackground from '@/components/beams-backgruond';
import {IconBrandGoogle} from '@tabler/icons-react';

const LoginPage: React.FC = () => {
  const { login,loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/'); // protected home
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
    <div className="glassmorphic-login-container">
      <style>{`
        .glassmorphic-login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem;
        }
        
        .glassmorphic-login-card {
          backdrop-filter: blur(10px);
          background-color: rgba(15, 15, 30, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          padding: 2rem;
          width: 100%;
          max-width: 420px;
          transition: all 0.3s ease;
        }
        
        .glassmorphic-login-card:hover {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 0.15);
          background-color: rgba(15, 15, 30, 0.35);
        }
        
        .glass-title {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .glass-input-group {
          margin-bottom: 1.5rem;
        }
        
        .glass-label {
          color: rgba(255, 255, 255, 0.8);
          display: block;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .glass-input-wrapper {
          position: relative;
        }
        
        .glass-input {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          width: 100%;
          transition: all 0.2s ease;
        }
        
        .glass-input:focus {
          background-color: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          outline: none;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        
        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        .glass-input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
        }
        
        .glass-button {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(79, 70, 229, 0.6));
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.75rem 1rem;
          width: 100%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .glass-button:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(79, 70, 229, 0.7));
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .glass-button:active {
          transform: translateY(0);
        }
        
        .glass-error {
          background-color: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 0.75rem;
        }

        .signup-link {
          text-align: center;
          margin-top: 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .signup-link a {
          color: rgba(99, 102, 241, 0.9);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .signup-link a:hover {
          color: rgba(99, 102, 241, 1);
          text-decoration: underline;
        }

        .oauth-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

.oauth-divider::before,
.oauth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.oauth-divider span {
  padding: 0 1rem;
}

.oauth-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
  width: 100%;
  margin-bottom: 1rem;
}

.oauth-button:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(66, 133, 244, 0.4);
  transform: translateY(-1px);
}
      `}</style>
      
      <div className="glassmorphic-login-card">
        <h2 className="glass-title">
          <LogIn className="h-6 w-6" />
          <span>Log In</span>
        </h2>
        
        {error && (
          <div className="glass-error">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        <button 
  type="button" 
  className="oauth-button"
  onClick={loginWithGoogle}
>
  <IconBrandGoogle className="h-4 w-4" />
  <span>Continue with Google</span>
</button>

{/* <div className="oauth-divider">
  <span>or continue with email</span>
</div> */}
        
        {/* <form onSubmit={handleSubmit}>
          <div className="glass-input-group">
            <label className="glass-label">Username</label>
            <div className="glass-input-wrapper">
              <User className="h-4 w-4 glass-input-icon" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="glass-input"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          
          <div className="glass-input-group">
            <label className="glass-label">Password</label>
            <div className="glass-input-wrapper">
              <Lock className="h-4 w-4 glass-input-icon" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="glass-input"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="glass-button">
            <LogIn className="h-5 w-5" />
            <span>Log In</span>
          </button>
          
          <div className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </div>
        </form> */}

        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;