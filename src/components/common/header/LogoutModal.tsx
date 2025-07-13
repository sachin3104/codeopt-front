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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 mx-2 xs:mx-3 sm:mx-4 md:mx-6 lg:mx-8 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/20 shadow-xl backdrop-blur-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 lg:top-6 lg:right-6 p-1 xs:p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
        </button>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6">Logout Confirmation</h3>
          <p className="text-gray-300 mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">Are you sure you want to logout?</p>
          
          {/* Buttons */}
          <div className="flex justify-center space-x-2 xs:space-x-3 sm:space-x-4 md:space-x-5 lg:space-x-6">
            <button
              onClick={onClose}
              className="px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-md xs:rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-md xs:rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl"
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