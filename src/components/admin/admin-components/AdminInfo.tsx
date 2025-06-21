import React from 'react';
import { Shield, Crown } from 'lucide-react';
import { formatAdminRole } from '@/api/admin';
import type { AdminUser } from '@/types/admin';

interface AdminInfoProps {
  admin: AdminUser;
}

export default function AdminInfo({ admin }: AdminInfoProps) {
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
      <h3 className="text-lg font-semibold text-white mb-4">Admin Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Admin Details Card */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
          <h4 className="text-white font-medium mb-4">Account Details</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Username:</span>
              <span className="text-white font-medium">{admin.username}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Email:</span>
              <span className="text-white font-medium">{admin.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Role:</span>
              <div className="flex items-center gap-2">
                {getRoleIcon(admin.role)}
                <span className="text-white font-medium">{formatAdminRole(admin.role)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Account Status:</span>
              <span className="text-green-400 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Session Info Card */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
          <h4 className="text-white font-medium mb-4">Session Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Last Login:</span>
              <span className="text-white font-medium">
                {admin.last_login 
                  ? new Date(admin.last_login).toLocaleString()
                  : 'First login'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Account Created:</span>
              <span className="text-white font-medium">
                {admin.created_at 
                  ? new Date(admin.created_at).toLocaleDateString()
                  : 'Unknown'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Session Status:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 