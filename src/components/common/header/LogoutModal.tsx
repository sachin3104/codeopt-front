import React from 'react';
import { X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-xs sm:max-w-md p-4 sm:p-6 mx-3 sm:mx-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/20 shadow-xl backdrop-blur-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Logout Confirmation</h3>
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Are you sure you want to logout?</p>
          
          {/* Buttons */}
          <div className="flex justify-center space-x-3 sm:space-x-4">
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-3 sm:px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal; 