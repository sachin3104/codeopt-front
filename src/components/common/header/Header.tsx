import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import logoUrl from '@/assets/logo_name.png';
import { ActionMenu } from '../actions';
import LanguageSelectModal from '../actions/LanguageSelectModal';
import { useConvert } from '@/hooks/use-convert';
import UserPlanButton from './UserPlanButton';
import LogoutModal from './LogoutModal';

// Header variants
export type HeaderVariant = 'default' | 'analyze' | 'optimize' | 'convert' | 'document';

interface HeaderProps {
  variant?: HeaderVariant;
}

const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { run: runConvert, clear: clearConvert } = useConvert();

  const openConvertModal = async () => {
    clearConvert();
    setShowConvertModal(true);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      navigate('/');
    } catch (error) {
      // Logout failed
    }
  };

  // Get action buttons based on variant
  const getActionButtons = () => {
    switch (variant) {
      case 'analyze':
        return (
          <ActionMenu
            actions={['optimize', 'convert', 'document']}
            variant="layout"
            onOverrides={{
              convert: openConvertModal,
            }}
          />
        );
      case 'optimize':
        return (
          <ActionMenu
            actions={['convert', 'document']}
            variant="layout"
            onOverrides={{
              convert: openConvertModal,
            }}
          />
        );
      case 'convert':
        return (
          <ActionMenu
            actions={['document']}
            variant="layout"
          />
        );
      case 'document':
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${
        variant === 'default' 
          ? 'bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-b border-white/20' 
          : ''
      }`}>
        <div className="container mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 xs:h-14 sm:h-16 md:h-18 lg:h-20">
            {/* Logo */}
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={handleLogoClick}
            >
              <img 
                src={logoUrl} 
                alt="Optqo Logo" 
                className="h-10 w-auto xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 mr-1 xs:mr-1.5 sm:mr-2 md:mr-2.5 lg:mr-3" 
              />
            </div>

            {/* Center Action Buttons - Only for results variants */}
            {variant !== 'default' && (
              <div className="flex-1 flex justify-center px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6">
                {getActionButtons()}
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 md:space-x-4">
              <UserPlanButton onLogoutClick={() => setShowLogoutModal(true)} />
            </div>
          </div>
        </div>
      </header>

      {/* Convert Modal */}
      <LanguageSelectModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
      />

      {/* Logout Modal - Rendered outside header context */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Header; 