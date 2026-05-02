import { useState, useCallback } from 'react'
import api from '../lib/api'

const DEFAULT_PAGINATION = { page: 1, totalPages: 1, total: 0 }

export function useJobIntelligence() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState(null)

  const fetchAnalyses = useCallback(async (filters = {}, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: 20 }
      if (filters.fit_level) params.fit_level = filters.fit_level
      if (filters.recommendation) params.recommendation = filters.recommendation
      if (filters.status) params.status = filters.status
      const res = await api.get('/job-intelligence/analyses', { params })
      const data = res.data
      setAnalyses(data.analyses || [])
      setPagination({
        page: data.page || page,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analyses')
    } finally {
      setLoading(false)
    }
  }, [])

  const analyze = useCallback(async ({ job_description, application_id }) => {
    setAnalyzing(true)
    setAnalyzeError(null)
    try {
      const payload = { job_description }
      if (application_id) payload.application_id = application_id
      const res = await api.post('/job-intelligence/analyze', payload)
      return res.data.analysis
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Analysis failed'
      setAnalyzeError(msg)
      throw err
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const deleteAnalysis = useCallback(async (id) => {
    await api.delete(`/job-intelligence/analyses/${id}`)
  }, [])

  const clearAnalyzeError = useCallback(() => setAnalyzeError(null), [])

  return {
    analyses,
    loading,
    error,
    pagination,
    analyzing,
    analyzeError,
    fetchAnalyses,
    analyze,
    deleteAnalysis,
    clearAnalyzeError,
  }
}
