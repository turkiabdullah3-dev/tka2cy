import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTasks } from '../hooks/useTasks'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const STATUSES = ['open', 'in_progress', 'completed', 'archived']
const PRIORITIES = ['low', 'medium', 'high']
const CATEGORIES = ['career', 'learning', 'project', 'security', 'personal']

const PRIORITY_COLORS = {
  low: '#4ade80',
  medium: '#fbbf24',
  high: '#f87171',
}

const STATUS_COLORS = {
  open: '#6366f1',
  in_progress: '#f59e0b',
  completed: '#22c55e',
  archived: '#52525b',
}

const CATEGORY_COLORS = {
  career: '#8b5cf6',
  learning: '#06b6d4',
  project: '#6366f1',
  security: '#f87171',
  personal: '#a1a1aa',
}

function Badge({ label, color }) {
  return (
    <span
      className="text-xs font-mono px-1.5 py-0.5 rounded capitalize"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label.replace('_', ' ')}
    </span>
  )
}

function CreateTaskForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    category: 'personal',
    due_date: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const { createTask } = useTasks()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setFormError('Title is required')
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      const payload = { ...form }
      if (!payload.due_date) delete payload.due_date
      if (!payload.description) delete payload.description
      const task = await createTask(payload)
      onCreated(task)
    } catch (err) {
      setFormError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full text-xs font-mono text-zinc-300 rounded px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500'
  const inputStyle = { backgroundColor: '#0d0e12', border: '1px solid #1e2028' }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {formError && (
        <div className="text-xs font-mono text-red-400 px-3 py-2 rounded" style={{ backgroundColor: '#1c0a0a', border: '1px solid #450a0a' }}>
          {formError}
        </div>
      )}

      <div>
        <label className="text-xs font-mono text-zinc-600 block mb-1">Title *</label>
        <input
          className={inputClass}
          style={inputStyle}
          placeholder="Task title…"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          maxLength={255}
        />
      </div>

      <div>
        <label className="text-xs font-mono text-zinc-600 block mb-1">Description</label>
        <textarea
          className={inputClass}
          style={inputStyle}
          placeholder="Optional description…"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Priority</label>
          <select className={inputClass} style={inputStyle} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Category</label>
          <select className={inputClass} style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Due Date</label>
          <input
            type="date"
            className={inputClass}
            style={inputStyle}
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="text-xs font-mono px-4 py-2 rounded transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#1e40af', color: '#93c5fd' }}
        >
          {submitting ? 'Creating…' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-mono px-4 py-2 rounded transition-colors text-zinc-500 hover:text-zinc-300"
          style={{ backgroundColor: '#1a1b22' }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function TaskRow({ task, onUpdate, onDelete }) {
  const [updating, setUpdating] = useState(false)

  async function handleStatusChange(newStatus) {
    setUpdating(true)
    try {
      await onUpdate(task.id, { status: newStatus })
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete task "${task.title}"?`)) return
    setUpdating(true)
    try {
      await onDelete(task.id)
    } finally {
      setUpdating(false)
    }
  }

  const isCompleted = task.status === 'completed'
  const isArchived = task.status === 'archived'

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-4 px-5 py-3.5 group"
      style={{ borderBottom: '1px solid #1e2028' }}
    >
      {/* Complete checkbox */}
      <button
        onClick={() => handleStatusChange(isCompleted ? 'open' : 'completed')}
        disabled={updating || isArchived}
        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors disabled:opacity-40"
        style={{
          borderColor: isCompleted ? '#22c55e' : '#3f3f46',
          backgroundColor: isCompleted ? '#22c55e20' : 'transparent',
        }}
        title={isCompleted ? 'Mark as open' : 'Mark as completed'}
      >
        {isCompleted && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5 3.5-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm text-zinc-200 ${isCompleted ? 'line-through text-zinc-500' : ''}`}>
            {task.title}
          </span>
          <Badge label={task.priority} color={PRIORITY_COLORS[task.priority]} />
          <Badge label={task.category} color={CATEGORY_COLORS[task.category]} />
          <Badge label={task.status} color={STATUS_COLORS[task.status]} />
        </div>
        {task.description && (
          <p className="text-xs text-zinc-600 mt-1 truncate">{task.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          {task.due_date && (
            <span className="text-xs font-mono text-zinc-600">
              Due {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
          <span className="text-xs font-mono text-zinc-700">
            {new Date(task.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {!isArchived && !isCompleted && (
          <button
            onClick={() => handleStatusChange('in_progress')}
            disabled={updating || task.status === 'in_progress'}
            className="text-[10px] font-mono px-2 py-1 rounded transition-colors text-zinc-500 hover:text-amber-400 disabled:opacity-40"
            style={{ backgroundColor: '#1a1b22' }}
            title="Mark in progress"
          >
            WIP
          </button>
        )}
        {!isArchived && (
          <button
            onClick={() => handleStatusChange('archived')}
            disabled={updating}
            className="text-[10px] font-mono px-2 py-1 rounded transition-colors text-zinc-500 hover:text-zinc-300 disabled:opacity-40"
            style={{ backgroundColor: '#1a1b22' }}
            title="Archive"
          >
            Archive
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={updating}
          className="text-[10px] font-mono px-2 py-1 rounded transition-colors text-zinc-500 hover:text-red-400 disabled:opacity-40"
          style={{ backgroundColor: '#1a1b22' }}
          title="Delete"
        >
          Delete
        </button>
      </div>
    </motion.div>
  )
}

export default function TasksPage() {
  const { tasks, loading, error, pagination, filters, fetchTasks, createTask, updateTask, deleteTask, updateFilters } = useTasks()
  const [showCreate, setShowCreate] = useState(false)
  const [localFilters, setLocalFilters] = useState({ status: '', priority: '', category: '' })

  useEffect(() => {
    fetchTasks(localFilters, 1)
  }, [])

  function handleFilterChange(key, val) {
    const next = { ...localFilters, [key]: val }
    setLocalFilters(next)
    fetchTasks(next, 1)
  }

  async function handleCreated(task) {
    setShowCreate(false)
    fetchTasks(localFilters, 1)
  }

  async function handleUpdate(id, updates) {
    try {
      await updateTask(id, updates)
      fetchTasks(localFilters, pagination.page)
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id)
      fetchTasks(localFilters, pagination.page)
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const selectClass = 'text-xs font-mono text-zinc-400 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500'
  const selectStyle = { backgroundColor: '#1a1b22', border: '1px solid #1e2028' }

  const openCount = tasks.filter((t) => t.status === 'open').length
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length
  const completedCount = tasks.filter((t) => t.status === 'completed').length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-mono text-zinc-300 font-medium">Daily Tasks</h1>
          <p className="text-xs text-zinc-600 mt-1">
            {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
            {openCount > 0 && ` · ${openCount} open`}
            {inProgressCount > 0 && ` · ${inProgressCount} in progress`}
            {completedCount > 0 && ` · ${completedCount} completed`}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="text-xs font-mono px-3 py-2 rounded transition-colors"
          style={{ backgroundColor: showCreate ? '#1a1b22' : '#1e3a8a', color: showCreate ? '#71717a' : '#93c5fd', border: '1px solid #1e2028' }}
        >
          {showCreate ? '✕ Cancel' : '+ New Task'}
        </button>
      </div>

      {error && (
        <div
          className="text-xs font-mono text-red-400 rounded px-4 py-3"
          style={{ backgroundColor: '#1c0a0a', border: '1px solid #450a0a' }}
        >
          {error}
        </div>
      )}

      {/* Create Form */}
      {showCreate && (
        <Card title="New Task">
          <CreateTaskForm
            onCreated={handleCreated}
            onCancel={() => setShowCreate(false)}
          />
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={localFilters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select
          value={localFilters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={localFilters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {(localFilters.status || localFilters.priority || localFilters.category) && (
          <button
            onClick={() => {
              const reset = { status: '', priority: '', category: '' }
              setLocalFilters(reset)
              fetchTasks(reset, 1)
            }}
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Task List */}
      <Card padding="p-0">
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="sm" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xs font-mono text-zinc-600 mb-2">No tasks found</div>
            {!showCreate && (
              <button
                onClick={() => setShowCreate(true)}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Create your first task →
              </button>
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid #1e2028' }}>
            <span className="text-xs font-mono text-zinc-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchTasks(localFilters, pagination.page - 1)}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-200 disabled:text-zinc-700 disabled:cursor-not-allowed px-2 py-1 rounded"
                style={{ backgroundColor: '#1a1b22' }}
              >
                Prev
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchTasks(localFilters, pagination.page + 1)}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-200 disabled:text-zinc-700 disabled:cursor-not-allowed px-2 py-1 rounded"
                style={{ backgroundColor: '#1a1b22' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
