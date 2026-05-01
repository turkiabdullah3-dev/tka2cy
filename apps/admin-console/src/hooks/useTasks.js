import { useState, useCallback } from 'react'
import api from '../lib/api'

const DEFAULT_FILTERS = { status: '', priority: '', category: '' }

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const fetchTasks = useCallback(async (currentFilters = filters, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: 50 }
      if (currentFilters.status) params.status = currentFilters.status
      if (currentFilters.priority) params.priority = currentFilters.priority
      if (currentFilters.category) params.category = currentFilters.category
      const res = await api.get('/tasks', { params })
      const data = res.data
      setTasks(data.tasks || [])
      setPagination({
        page: data.page || page,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createTask = useCallback(async (taskData) => {
    const res = await api.post('/tasks', taskData)
    return res.data.task
  }, [])

  const updateTask = useCallback(async (id, updates) => {
    const res = await api.patch(`/tasks/${id}`, updates)
    return res.data.task
  }, [])

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`)
  }, [])

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  return {
    tasks,
    loading,
    error,
    pagination,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateFilters,
  }
}
