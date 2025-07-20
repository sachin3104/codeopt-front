import React from 'react';
import type { AdminUser } from '@/types/admin';

interface AdminInfoProps {
  admin: AdminUser;
}

export default function AdminInfo({ admin }: AdminInfoProps) {
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
          </div>
        </div>
      </div>
    </div>
  );
} 