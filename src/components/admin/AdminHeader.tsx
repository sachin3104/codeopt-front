// src/components/admin/AdminHeader.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Shield, User, Crown, Home, Users, ChevronDown } from 'lucide-react';
import { adminLogout, getAdminDisplayName, formatAdminRole } from '@/api/admin';
import type { AdminUser } from '@/types/admin';

interface AdminHeaderProps {
  admin: AdminUser;
  onLogout: () => void;
}

export default function AdminHeader({ admin, onLogout }: AdminHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Navigation items
  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: Home,
      description: 'Overview and analytics'
    },
    {
      label: 'User Management',
      path: '/admin/users',
      icon: Users,
      description: 'Manage user accounts'
    }
  ];

  // Get current page info
  const getCurrentPage = () => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem || { label: 'Admin Panel', path: currentPath, icon: Shield };
  };

  const currentPage = getCurrentPage();

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    setShowNavDropdown(false);
  };

  return (
    <header className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side - Brand & Navigation */}
          <div className="flex items-center gap-6">
            
            {/* Brand */}
            <button
              onClick={() => handleNavigation('/admin/dashboard')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                optqo
              </h1>
              <span className="ml-2 text-white/60 text-sm font-medium">
                Admin
              </span>
            </button>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-white/20 text-white border border-white/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Navigation - Mobile Dropdown */}
            <div className="md:hidden relative">
              <button
                onClick={() => setShowNavDropdown(!showNavDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-all duration-200"
              >
                <currentPage.icon size={16} />
                <span className="hidden sm:inline">{currentPage.label}</span>
                <ChevronDown size={14} className={`transition-transform ${showNavDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Mobile Navigation Dropdown */}
              {showNavDropdown && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNavDropdown(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-64 backdrop-blur-md bg-black/80 border border-white/20 rounded-lg shadow-xl z-20">
                    <div className="py-2">
                      {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        
                        return (
                          <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`
                              w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                              ${isActive 
                                ? 'bg-white/20 text-white' 
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                              }
                            `}
                          >
                            <Icon size={18} />
                            <div className="flex flex-col">
                              <span className="font-medium">{item.label}</span>
                              <span className="text-xs text-white/60">{item.description}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Side - Admin Info & Actions */}
          <div className="flex items-center gap-4">
            
            {/* Admin Info - Desktop */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20">
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

            {/* Admin Info - Mobile/Tablet */}
            <div className="lg:hidden flex items-center gap-2">
              {getRoleIcon(admin.role)}
              <span className="text-white text-sm font-medium hidden sm:inline">
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
        <div className="lg:hidden pb-3 border-t border-white/10 mt-2 pt-3">
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
            
            {/* Current Page Indicator - Mobile */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
              <currentPage.icon size={14} className="text-white/70" />
              <span className="text-white/70 text-xs font-medium">{currentPage.label}</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb Bar - Desktop */}
        <div className="hidden md:block pb-3 border-t border-white/10 mt-2 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/60">Admin Panel</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80 font-medium">{currentPage.label}</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}