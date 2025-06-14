import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, CreditCard, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LogoutModal from './LogoutModal';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setIsLogoutModalOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">optqo</h1>
            </div>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              >
                <User className="w-6 h-6 text-white" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 shadow-lg">
                  <div className="py-1">
                    <a
                      href="#profile"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      <UserCircle className="w-4 h-4 mr-2" />
                      Profile
                    </a>
                    <a
                      href="#subscription"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Subscription
                    </a>
                    <a
                      href="#settings"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </a>
                    <div className="border-t border-white/20 my-1"></div>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Header; 