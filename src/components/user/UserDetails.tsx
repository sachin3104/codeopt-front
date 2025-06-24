import React from 'react';
import { User, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const UserDetails: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
        <p className="text-white/70 text-center">No user data available</p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <User className="w-5 h-5 mr-2" />
        User Details
      </h2>
      
      <div className="space-y-6 p-2">
        {/* Username */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-sm">Username</p>
            <p className="text-white font-medium">{user.username}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-sm">Email</p>
            <p className="text-white font-medium">{user.email}</p>
          </div>
        </div>

        {/* Approval Status */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-sm">Approval Status</p>
            <div className="flex items-center space-x-2">
              {user.is_approved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Approved</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium">Pending Approval</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 