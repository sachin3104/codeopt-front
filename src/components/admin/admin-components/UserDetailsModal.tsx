import React from 'react';
import { XCircle, Globe, Shield, AtSign } from 'lucide-react';
import { 
  getUserDisplayName, 
  formatUserStatus, 
  formatAuthProvider, 
  formatDate 
} from '@/api/admin';
import type { RegularUser } from '@/types/admin';
import { UserActionType } from '@/types/admin';

interface UserDetailsModalProps {
  user: RegularUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUserAction: (userId: string, action: UserActionType) => void;
}

export default function UserDetailsModal({ 
  user, 
  isOpen, 
  onClose, 
  onUserAction 
}: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  // Get status badge component
  const getStatusBadge = (user: RegularUser) => {
    const status = formatUserStatus(user);
    const colors = {
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[status.color as keyof typeof colors]}`}>
        {status.status}
      </span>
    );
  };

  // Get auth provider icon
  const getAuthProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'google':
        return <Globe size={14} className="text-blue-400" />;
      case 'linkedin':
        return <Shield size={14} className="text-blue-500" />;
      case 'local':
        return <AtSign size={14} className="text-gray-400" />;
      default:
        return <AtSign size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">User Details</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/80 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm">Display Name</label>
              <p className="text-white font-medium">{getUserDisplayName(user)}</p>
            </div>
            <div>
              <label className="text-white/70 text-sm">Email</label>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-white/70 text-sm">Username</label>
              <p className="text-white font-medium">{user.username || 'N/A'}</p>
            </div>
            <div>
              <label className="text-white/70 text-sm">Status</label>
              <div className="mt-1">{getStatusBadge(user)}</div>
            </div>
            <div>
              <label className="text-white/70 text-sm">Auth Provider</label>
              <div className="flex items-center gap-2 mt-1">
                {getAuthProviderIcon(user.auth_provider)}
                <span className="text-white">{formatAuthProvider(user.auth_provider)}</span>
              </div>
            </div>
            <div>
              <label className="text-white/70 text-sm">Account Created</label>
              <p className="text-white font-medium">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <label className="text-white/70 text-sm">Last Login</label>
              <p className="text-white font-medium">{formatDate(user.last_login)}</p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-white/20">
            {!user.is_approved && (
              <button
                onClick={() => {
                  onUserAction(user.id, UserActionType.APPROVE);
                  onClose();
                }}
                className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                Approve User
              </button>
            )}
            
            {user.is_approved && (
              <button
                onClick={() => {
                  onUserAction(user.id, UserActionType.REJECT);
                  onClose();
                }}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Reject User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 