import React from 'react';
import { Users, UserCheck, Clock, TrendingUp, Activity } from 'lucide-react';
import type { UserStats } from '@/types/admin';

interface UserStatisticsProps {
  stats: UserStats | null;
}

export default function UserStatistics({ stats }: UserStatisticsProps) {
  return (
    <div className="grid grid-cols-5 gap-4 overflow-x-auto min-w-max">
      {/* Total Users */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 min-w-[160px]">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-blue-400" />
          <span className="text-white/70 text-xs font-medium">Total Users</span>
        </div>
        <p className="text-xl font-bold text-white mb-1">{stats?.total_users.toLocaleString() || '0'}</p>
        <div className="flex items-center gap-1 text-xs">
          <Activity size={10} className="text-green-400" />
          <span className="text-green-400">{stats?.active_users || 0} active</span>
        </div>
      </div>

      {/* Approved Users */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 min-w-[160px]">
        <div className="flex items-center gap-2 mb-2">
          <UserCheck size={16} className="text-green-400" />
          <span className="text-white/70 text-xs font-medium">Approved</span>
        </div>
        <p className="text-xl font-bold text-white mb-1">{stats?.approved_users.toLocaleString() || '0'}</p>
        <div className="text-xs text-white/60">
          {stats && stats.total_users > 0 ? ((stats.approved_users / stats.total_users) * 100).toFixed(1) : '0'}% of total
        </div>
      </div>

      {/* Pending Users */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 min-w-[160px]">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-yellow-400" />
          <span className="text-white/70 text-xs font-medium">Pending</span>
        </div>
        <p className="text-xl font-bold text-white mb-1">{stats?.pending_users.toLocaleString() || '0'}</p>
        {stats && stats.pending_users > 0 && (
          <div className="text-xs text-yellow-400">
            Needs review
          </div>
        )}
      </div>

      {/* Recent Users */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 min-w-[160px]">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="text-purple-400" />
          <span className="text-white/70 text-xs font-medium">Recent (7d)</span>
        </div>
        <p className="text-xl font-bold text-white mb-1">{stats?.recent_users.toLocaleString() || '0'}</p>
        <div className="text-xs text-white/60">
          New registrations
        </div>
      </div>

      {/* Auth Providers */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 min-w-[160px]">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-indigo-400" />
          <span className="text-white/70 text-xs font-medium">Auth Providers</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/70">Local</span>
            <span className="text-white font-medium">{stats?.auth_providers?.local || 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/70">Google</span>
            <span className="text-white font-medium">{stats?.auth_providers?.google || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 