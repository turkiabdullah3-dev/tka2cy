import { useState, useCallback } from 'react'
import api from '../lib/api'

const DEFAULT_FILTERS = { status: '', priority: '', source: '', search: '' }
const DEFAULT_STATS = { total: 0, saved: 0, applied: 0, interviews: 0, followUpsDue: 0 }

export function useApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [statsLoading, setStatsLoading] = useState(false)

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const res = await api.get('/applications/stats')
      setStats(res.data.stats || DEFAULT_STATS)
    } catch {
      // non-fatal
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const fetchApplications = useCallback(async (currentFilters = filters, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: 50 }
      if (currentFilters.status) params.status = currentFilters.status
      if (currentFilters.priority) params.priority = currentFilters.priority
      if (currentFilters.source) params.source = currentFilters.source
      if (currentFilters.search) params.search = currentFilters.search
      const res = await api.get('/applications', { params })
      const data = res.data
      setApplications(data.applications || [])
      setPagination({
        page: data.page || page,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createApplication = useCallback(async (data) => {
    const res = await api.post('/applications', data)
    return res.data.application
  }, [])

  const updateApplication = useCallback(async (id, updates) => {
    const res = await api.patch(`/applications/${id}`, updates)
    return res.data.application
  }, [])

  const deleteApplication = useCallback(async (id) => {
    await api.delete(`/applications/${id}`)
  }, [])

  return {
    applications,
    loading,
    error,
    pagination,
    filters,
    stats,
    statsLoading,
    fetchApplications,
    fetchStats,
    createApplication,
    updateApplication,
    deleteApplication,
  }
}
