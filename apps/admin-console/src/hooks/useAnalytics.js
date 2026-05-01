import { useState, useCallback } from 'react'
import api from '../lib/api'

export function useAnalytics() {
  const [summary, setSummary] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/analytics/summary')
      setSummary(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics summary')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEvents = useCallback(async ({ event_type = '', page = 1 } = {}) => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: 20 }
      if (event_type) params.event_type = event_type
      const res = await api.get('/analytics/events', { params })
      const data = res.data
      setEvents(data.events || [])
      setPagination({
        page: data.page || page,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics events')
    } finally {
      setLoading(false)
    }
  }, [])

  return { summary, events, loading, error, pagination, fetchSummary, fetchEvents }
}
