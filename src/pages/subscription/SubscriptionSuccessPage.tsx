// src/pages/subscription/SubscriptionSuccessPage.tsx
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/use-subscription'

const SubscriptionSuccessPage: React.FC = () => {
  const { refresh } = useSubscription()
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const sessionId = params.get('session_id')

    if (!sessionId) {
      setError('Missing session_id in URL.')
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        await refresh()
        toast.success("🎉 Your subscription is now active!")
        navigate('/subscription', { replace: true })
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to update subscription.')
      } finally {
        setLoading(false)
      }
    })()
  }, [location.search, refresh, navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {loading && (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
          <p className="text-gray-700">Updating your subscription…</p>
        </>
      )}
      {error && (
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => navigate('/subscription')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Plans
          </button>
        </div>
      )}
    </div>
  )
}

export default SubscriptionSuccessPage
