import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Code } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="glassmorphic-header">
      <style>{`
        .glassmorphic-header {
          backdrop-filter: blur(10px);
          background-color: rgba(15, 15, 30, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          padding: 1rem;
          transition: all 0.3s ease;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        
        .glassmorphic-header:hover {
          background-color: rgba(15, 15, 30, 0.35);
          border-color: rgba(255, 255, 255, 0.15);
        }
        
        .glass-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .glass-logo:hover {
          color: rgba(255, 255, 255, 1);
          transform: translateY(-1px);
        }
        
        .glass-btn {
          background-color: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.85);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }
        
        .glass-btn:hover {
          background-color: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .glass-btn-logout {
          background-color: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
        }
        
        .glass-btn-logout:hover {
          background-color: rgba(239, 68, 68, 0.3);
          border-color: rgba(239, 68, 68, 0.4);
        }
        
        .welcome-text {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="glass-logo">
          <Code className="h-5 w-5" />
          <span>optqo</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          
          <button
            onClick={handleLogout}
            className="glass-btn glass-btn-logout"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;