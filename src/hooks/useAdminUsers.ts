import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getUsers, getUserStats, getSubscriptionPlans, upgradeUserSubscription } from '@/api/admin'
import type { GetUsersParams, RegularUser, UserStats } from '@/types/admin'

export function useAdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [users, setUsers] = useState<RegularUser[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [plans, setPlans] = useState<{ id: string; plan_type: string; name: string; description?: string }[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isLoadingPlans, setIsLoadingPlans] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize filters from URL params
  const getInitialFilters = (): GetUsersParams => ({
    page: parseInt(searchParams.get('page') || '1'),
    per_page: 50, // Fixed at 50 per page
    search: searchParams.get('search') || '',
    sort_by: (searchParams.get('sort_by') as 'created_at' | 'last_login') || 'created_at',
    sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
    auth_provider: (searchParams.get('auth_provider') as 'local' | 'google' | 'all') || 'all',
  })

  // filter & pagination state
  const [filters, setFilters] = useState<GetUsersParams>(getInitialFilters)

  // Debounced search
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString())
    if (filters.search) params.set('search', filters.search)
    if (filters.sort_by && filters.sort_by !== 'created_at') params.set('sort_by', filters.sort_by)
    if (filters.sort_order && filters.sort_order !== 'desc') params.set('sort_order', filters.sort_order)
    if (filters.auth_provider && filters.auth_provider !== 'all') params.set('auth_provider', filters.auth_provider)
    
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  // fetch users whenever filters change
  useEffect(() => {
    const load = async () => {
      setIsLoadingUsers(true)
      setError(null)
      try {
        const res = await getUsers(filters)
        if (res.data.status === 'success') {
          setUsers(res.data.users)
        } else {
          setError('Failed to fetch users')
        }
      } catch (e: any) {
        setError(e.message || 'Failed to fetch users')
      } finally {
        setIsLoadingUsers(false)
      }
    }

    load()
  }, [filters])

  // fetch stats once on mount
  useEffect(() => {
    const loadStats = async () => {
      setIsLoadingStats(true)
      try {
        const res = await getUserStats()
        if (res.data.status === 'success') {
          setStats(res.data.stats)
        }
      } finally {
        setIsLoadingStats(false)
      }
    }
    loadStats()
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // helpers to update filters
  const onSearchChange = useCallback((search: string) => {
    setSearchTerm(search)
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(f => ({ ...f, search, page: 1 }))
    }, 300) // 300ms delay
  }, [])

  const onSortChange = useCallback((sort_by: 'created_at'|'last_login', sort_order: 'asc'|'desc') => {
    setFilters(f => ({ ...f, sort_by, sort_order, page: 1 }))
  }, [])

  const onPageChange = useCallback((page: number) => {
    setFilters(f => ({ ...f, page }))
  }, [])

  const onPerPageChange = useCallback((per_page: number) => {
    setFilters(f => ({ ...f, per_page, page: 1 }))
  }, [])

  const onProviderChange = useCallback((auth_provider: 'local'|'google'|'all') => {
    setFilters(f => ({ ...f, auth_provider, page: 1 }))
  }, [])

  // Reset filters to defaults
  const onReset = useCallback(() => {
    setSearchTerm('')
    setFilters({
      page: 1,
      per_page: 50, // Fixed at 50 per page
      search: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      auth_provider: 'all',
    })
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  // Load stats function (extracted for reuse)
  const loadStats = useCallback(async () => {
    setIsLoadingStats(true)
    try {
      const res = await getUserStats()
      if (res.data.status === 'success') {
        setStats(res.data.stats)
      }
    } finally {
      setIsLoadingStats(false)
    }
  }, [])

  // Refetch function for after user actions
  const refetch = useCallback(() => {
    setFilters(f => ({ ...f })) // Trigger useEffect by updating filters
  }, [])

  // Load subscription plans
  const loadPlans = useCallback(async () => {
    setIsLoadingPlans(true)
    try {
      const res = await getSubscriptionPlans()
      if (res.data.status === 'success') {
        console.log('Loaded plans from API:', res.data.plans);
        setPlans(res.data.plans)
      }
    } catch (e: any) {
      console.error('Failed to load plans:', e)
    } finally {
      setIsLoadingPlans(false)
    }
  }, [])

  // Convert plan type to backend format
  const convertPlanTypeToBackend = (planType: string): 'pro' | 'ultimate' | 'free' => {
    switch (planType.toLowerCase()) {
      case 'pro':
      case 'PRO':
        return 'pro';
      case 'ultimate':
      case 'ULTIMATE':
        return 'ultimate';
      case 'free':
      case 'FREE':
        return 'free';
      default:
        return 'pro'; // fallback
    }
  };

  // Upgrade subscription action
  const upgradeSubscription = useCallback(
    async (userId: string, planType: 'pro' | 'ultimate' | 'free', days: number) => {
      try {
        // Ensure plan type is in correct format for backend
        const backendPlanType = convertPlanTypeToBackend(planType);
        console.log('useAdminUsers - upgradeSubscription:', {
          userId,
          originalPlanType: planType,
          backendPlanType,
          days
        });
        await upgradeUserSubscription(userId, backendPlanType, days)
        // Re-fetch user list & stats to reflect new subscription
        await Promise.all([
          setFilters(f => ({ ...f })), // Trigger users refetch
          loadStats()
        ])
      } catch (e: any) {
        console.error('useAdminUsers - upgradeSubscription error:', e);
        throw new Error(e.response?.data?.message || 'Failed to upgrade subscription')
      }
    },
    [loadStats]
  )

  return {
    users, stats, plans,
    filters: { ...filters, search: searchTerm }, // Use searchTerm for UI
    isLoadingUsers, isLoadingStats, isLoadingPlans,
    error,
    onSearchChange,
    onSortChange,
    onPageChange,
    onPerPageChange,
    onProviderChange,
    onReset,
    refetch,
    loadPlans,
    upgradeSubscription,
  }
} 