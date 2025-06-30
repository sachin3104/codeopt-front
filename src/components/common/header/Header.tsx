import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { ActionMenu } from '../actions/CommonActionButtons';
import LanguageSelectModal from '../actions/LanguageSelectModal';
import { useConvert } from '@/hooks/use-convert';
import UserPlanButton from './UserPlanButton';

// Header variants
export type HeaderVariant = 'default' | 'analyze' | 'optimize' | 'convert' | 'document';

interface HeaderProps {
  variant?: HeaderVariant;
}

const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
  const [showConvertModal, setShowConvertModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { run: runConvert } = useConvert();

  const handleLogoClick = () => {
    navigate('/');
  };

  // Handler for convert modal
  const handleConvert = async (from: string, to: string) => {
    try {
      await runConvert(from, to);
      navigate('/results/convert');
    } catch {/* error will show via convertError */}
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
              convert: async () => setShowConvertModal(true),
            }}
          />
        );
      case 'optimize':
        return (
          <ActionMenu
            actions={['convert', 'document']}
            variant="layout"
            onOverrides={{
              convert: async () => setShowConvertModal(true),
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 
                onClick={handleLogoClick}
                className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
              >
                optqo
              </h1>
            </div>

            {/* Center Action Buttons - Only for results variants */}
            {variant !== 'default' && (
              <div className="flex-1 flex justify-center">
                {getActionButtons()}
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {/* Combined User Plan Button */}
              <UserPlanButton />
            </div>
          </div>
        </div>
      </header>

      {/* Convert Modal */}
      <LanguageSelectModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onConvert={handleConvert}
      />
    </>
  );
};

export default Header; 