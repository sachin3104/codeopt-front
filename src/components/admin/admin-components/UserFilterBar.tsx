import React from 'react'
import { Download, Loader2 } from 'lucide-react'
import type { GetUsersParams } from '@/types/admin'

interface Props {
  filters: GetUsersParams
  onSearchChange: (s: string) => void
  onSortChange: (sort_by: 'created_at'|'last_login', sort_order: 'asc'|'desc') => void
  onProviderChange: (auth_provider: 'local'|'google'|'all') => void
  onReset: () => void
  onExport: () => void
  isExporting: boolean
}

export default function UserFilterBar({
  filters,
  onSearchChange,
  onSortChange,
  onProviderChange,
  onReset,
  onExport,
  isExporting,
}: Props) {
  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={filters.search || ''}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
          />
        </div>

        {/* Sort By */}
        <div className="min-w-[150px]">
          <select
            value={filters.sort_by || 'created_at'}
            onChange={e => onSortChange(
              e.target.value as 'created_at' | 'last_login',
              filters.sort_order || 'desc'
            )}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
          >
            <option value="created_at" className="bg-gray-800">Date Created</option>
            <option value="last_login" className="bg-gray-800">Last Login</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="min-w-[120px]">
          <select
            value={filters.sort_order || 'desc'}
            onChange={e => onSortChange(
              filters.sort_by || 'created_at',
              e.target.value as 'asc' | 'desc'
            )}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
          >
            <option value="desc" className="bg-gray-800">Newest First</option>
            <option value="asc" className="bg-gray-800">Oldest First</option>
          </select>
        </div>

        {/* Auth Provider */}
        <div className="min-w-[140px]">
          <select
            value={filters.auth_provider || 'all'}
            onChange={e => onProviderChange(e.target.value as 'local' | 'google' | 'all')}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
          >
            <option value="all" className="bg-gray-800">All Providers</option>
            <option value="local" className="bg-gray-800">Local</option>
            <option value="google" className="bg-gray-800">Google</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="min-w-[100px]">
          <button
            onClick={onReset}
            className="w-full px-3 py-2 text-sm font-medium text-white/70 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Export Button */}
        <div className="min-w-[120px]">
          <button
            onClick={onExport}
            disabled={isExporting}
            className="w-full px-3 py-2 text-sm font-medium text-green-400 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 