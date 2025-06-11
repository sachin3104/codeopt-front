// src/components/admin/AdminLayout.tsx
import React from 'react';
import AdminHeader from './AdminHeader';
import type { AdminUser } from '@/types/admin';

interface AdminLayoutProps {
  admin: AdminUser;
  onLogout: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AdminLayout({ 
  admin, 
  onLogout, 
  children, 
  title, 
  subtitle 
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      
      {/* Admin Header */}
      <AdminHeader admin={admin} onLogout={onLogout} />
      
      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Page Title Section */}
        {(title || subtitle) && (
          <div className="backdrop-blur-md bg-gradient-to-br from-black/20 via-black/10 to-black/20 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
        )}
        
        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Content Container with Glassmorphism */}
          <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Content Area */}
            <div className="p-6 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-t border-white/20 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} optqo Admin Panel. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span>Version 1.0</span>
              <span>•</span>
              <span>Admin Dashboard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Alternative minimal layout without glassmorphism container (for full-width content)
export function AdminLayoutMinimal({ 
  admin, 
  onLogout, 
  children, 
  title, 
  subtitle 
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      
      {/* Admin Header */}
      <AdminHeader admin={admin} onLogout={onLogout} />
      
      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Page Title Section */}
        {(title || subtitle) && (
          <div className="backdrop-blur-md bg-gradient-to-br from-black/20 via-black/10 to-black/20 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
        )}
        
        {/* Page Content - No Container */}
        <div className="py-8">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-t border-white/20 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} optqo Admin Panel. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span>Version 1.0</span>
              <span>•</span>
              <span>Admin Dashboard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}