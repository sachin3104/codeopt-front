import React from 'react';
import { CheckCircle, Shield, Crown } from 'lucide-react';
import { getAdminDisplayName, formatAdminRole } from '@/api/admin';
import type { AdminUser } from '@/types/admin';

interface WelcomeMessageProps {
  admin: AdminUser;
}

export default function WelcomeMessage({ admin }: WelcomeMessageProps) {
  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown size={20} className="text-yellow-400" />;
      case 'admin':
        return <Shield size={20} className="text-blue-400" />;
      default:
        return <Shield size={20} className="text-gray-400" />;
    }
  };

  return (
    <div>
      <div className="backdrop-blur-sm bg-gradient-to-r from-green-500/20 via-green-500/10 to-green-500/20 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle size={24} className="text-green-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-1">
              Welcome back, {getAdminDisplayName(admin)}!
            </h2>
            <p className="text-green-200">
              You have successfully logged into the admin panel.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
            {getRoleIcon(admin.role)}
            <span className="text-white text-sm font-medium">
              {formatAdminRole(admin.role)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 