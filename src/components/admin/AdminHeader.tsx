// src/components/admin/AdminHeader.tsx
import React, { useState } from 'react';
import { LogOut, Shield, User, Crown } from 'lucide-react';
import { adminLogout, getAdminDisplayName, formatAdminRole } from '@/api/admin';
import type { AdminUser } from '@/types/admin';

interface AdminHeaderProps {
  admin: AdminUser;
  onLogout: () => void;
}

export default function AdminHeader({ admin, onLogout }: AdminHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await adminLogout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect user for security
      onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown size={16} className="text-yellow-400" />;
      case 'admin':
        return <Shield size={16} className="text-blue-400" />;
      default:
        return <User size={16} className="text-gray-400" />;
    }
  };

  return (
    <header className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side - Brand & Admin Info */}
          <div className="flex items-center gap-6">
            
            {/* Brand */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                optqo
              </h1>
              <span className="ml-2 text-white/60 text-sm font-medium">
                Admin
              </span>
            </div>

            {/* Admin Info */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20">
              {getRoleIcon(admin.role)}
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">
                  {getAdminDisplayName(admin)}
                </span>
                <span className="text-white/60 text-xs">
                  {formatAdminRole(admin.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-4">
            
            {/* Mobile Admin Info */}
            <div className="sm:hidden flex items-center gap-2">
              {getRoleIcon(admin.role)}
              <span className="text-white text-sm font-medium">
                {admin.username}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`
                flex items-center gap-2 px-4 py-2
                backdrop-blur-sm bg-white/10 hover:bg-white/20
                border border-white/20 hover:border-white/30
                rounded-lg
                text-white/80 hover:text-white
                transition-all duration-300
                transform hover:scale-105 disabled:scale-100
                focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-transparent
                ${isLoggingOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline text-sm font-medium">Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut size={16} />
                  <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Admin Info Row */}
        <div className="sm:hidden pb-3 border-t border-white/10 mt-2 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {getAdminDisplayName(admin)}
                </p>
                <p className="text-white/60 text-xs">
                  {formatAdminRole(admin.role)} • {admin.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}