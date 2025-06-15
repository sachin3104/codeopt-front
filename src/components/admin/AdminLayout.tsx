// src/components/admin/AdminLayout.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import type { AdminUser } from '@/types/admin';

interface AdminLayoutProps {
  admin: AdminUser;
  onLogout: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  fullWidth?: boolean;
  showTitleSection?: boolean;
}

// Page configuration for automatic titles and breadcrumbs
const PAGE_CONFIG = {
  '/admin/dashboard': {
    title: 'Admin Dashboard',
    subtitle: 'Welcome to the administration panel',
    fullWidth: false
  },
  '/admin/users': {
    title: 'User Management',
    subtitle: 'Manage user accounts and permissions',
    fullWidth: true
  }
} as const;

export default function AdminLayout({ 
  admin, 
  onLogout, 
  children, 
  title: customTitle, 
  subtitle: customSubtitle,
  fullWidth = false,
  showTitleSection = true
}: AdminLayoutProps) {
  const location = useLocation();
  
  // Get page configuration
  const pageConfig = PAGE_CONFIG[location.pathname as keyof typeof PAGE_CONFIG];
  
  // Use custom props or fall back to page config
  const title = customTitle || pageConfig?.title;
  const subtitle = customSubtitle || pageConfig?.subtitle;
  const shouldUseFullWidth = fullWidth || pageConfig?.fullWidth || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      
      {/* Admin Header */}
      <AdminHeader admin={admin} onLogout={onLogout} />
      
      {/* Main Content Area */}
      <main className="flex-1 min-h-[calc(100vh-200px)]">
        
        {/* Page Title Section */}
        {showTitleSection && (title || subtitle) && (
          <div className="backdrop-blur-md bg-gradient-to-br from-black/20 via-black/10 to-black/20 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  {title && (
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-2">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-white/70 text-lg">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Page Content */}
        {shouldUseFullWidth ? (
          // Full width layout for tables and complex layouts
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        ) : (
          // Contained layout with glassmorphism container
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 sm:p-8">
                {children}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-t border-white/20 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-white/60 text-sm text-center sm:text-left">
                &copy; {new Date().getFullYear()} optqo Admin Panel. All rights reserved.
              </p>
              <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></div>
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <span>Admin:</span>
                <span className="text-white/70 font-medium">{admin.username}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>Version 1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}