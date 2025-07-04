import React from 'react';
import { Monitor, Smartphone, ArrowRight, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const MobileOnlyPage: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:24px_24px]"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg mx-auto">
          {/* Main card with glassmorphism */}
          <div className="backdrop-blur-md bg-gradient-to-br from-black/60 via-black/50 to-black/40 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-[inherit] blur-xl"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header with icons */}
              <div className="text-center mb-8 sm:mb-10">
                <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="relative">
                    <Smartphone className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">×</span>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-white/40" />
                  <Monitor className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
                </div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-4 sm:mb-6">
                  Desktop Experience Required
                </h1>
                
                <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                  This application is designed for desktop and laptop computers to provide the best experience for code analysis and optimization.
                </p>
              </div>
              
              
                             {/* Logout button */}
               <div className="flex justify-center mb-6 sm:mb-8">
                 <button
                   onClick={handleLogout}
                   className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 backdrop-blur-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg focus:outline-none transition-all duration-300 border border-red-500/30 hover:border-red-500/40 text-sm sm:text-base font-medium hover:scale-105 transform"
                 >
                   <LogOut size={16} className="sm:w-5 sm:h-5" />
                   <span>Logout</span>
                 </button>
               </div>
               
               {/* Footer note */}
               <div className="text-center">
                 <p className="text-white/50 text-xs sm:text-sm">
                   Mobile users can still access the landing page and learn about our features
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOnlyPage; 