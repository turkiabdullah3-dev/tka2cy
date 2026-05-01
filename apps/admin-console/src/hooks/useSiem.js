import { useState, useCallback } from 'react'
import api from '../lib/api'

const DEFAULT_FILTERS = {
  severity: '',
  event_type: '',
  status: '',
}

export function useSiem() {
  const [events, setEvents] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const fetchEvents = useCallback(async (currentFilters = filters, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: 20 }
      if (currentFilters.severity) params.severity = currentFilters.severity
      if (currentFilters.event_type) params.event_type = currentFilters.event_type
      if (currentFilters.status) params.status = currentFilters.status

      const res = await api.get('/siem/events', { params })
      const data = res.data
      setEvents(data.events || data.data || [])
      setPagination({
        page: data.page || page,
        totalPages: data.totalPages || data.total_pages || 1,
        total: data.total || 0,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.get('/siem/summary')
      setSummary(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch summary')
    }
  }, [])

  const resolveEvent = useCallback(async (id) => {
    try {
      await api.patch(`/siem/events/${id}/resolve`)
      await fetchEvents(filters, pagination.page)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve event')
    }
  }, [filters, pagination.page, fetchEvents])

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  return {
    events,
    summary,
    loading,
    error,
    pagination,
    filters,
    fetchEvents,
    fetchSummary,
    resolveEvent,
    updateFilters,
  }
}
