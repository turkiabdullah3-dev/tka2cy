import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useApplications } from '../hooks/useApplications'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const STATUSES = [
  'saved', 'ready_to_apply', 'applied', 'screening',
  'interview', 'technical_task', 'offer', 'rejected', 'withdrawn',
]
const PRIORITIES = ['low', 'medium', 'high']
const SOURCES = ['manual', 'linkedin', 'company_site', 'email', 'referral', 'other']

const STATUS_COLORS = {
  saved: '#71717a',
  ready_to_apply: '#6366f1',
  applied: '#3b82f6',
  screening: '#f59e0b',
  interview: '#10b981',
  technical_task: '#f97316',
  offer: '#22c55e',
  rejected: '#ef4444',
  withdrawn: '#52525b',
}

const PRIORITY_COLORS = {
  low: '#4ade80',
  medium: '#fbbf24',
  high: '#f87171',
}

const SOURCE_COLORS = {
  manual: '#71717a',
  linkedin: '#60a5fa',
  company_site: '#a78bfa',
  email: '#fbbf24',
  referral: '#34d399',
  other: '#71717a',
}

function Badge({ label, color }) {
  return (
    <span
      className="text-xs font-mono px-1.5 py-0.5 rounded capitalize"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label.replace(/_/g, ' ')}
    </span>
  )
}

function KpiCard({ label, value, accent, loading }) {
  return (
    <div
      className="rounded p-4 flex flex-col gap-1"
      style={{ backgroundColor: '#0d0e12', border: '1px solid #1e2028' }}
    >
      <span className="text-xs font-mono text-zinc-600">{label}</span>
      {loading ? (
        <div style={{ width: '32px', height: '20px', borderRadius: '4px', backgroundColor: '#1e2028' }} />
      ) : (
        <span className="text-xl font-mono font-medium" style={{ color: accent || '#a1a1aa' }}>
          {value}
        </span>
      )}
    </div>
  )
}

const EMPTY_FORM = {
  company: '',
  job_title: '',
  job_url: '',
  location: '',
  source: 'manual',
  status: 'saved',
  priority: 'medium',
  notes: '',
  job_description: '',
  applied_at: '',
  follow_up_at: '',
}

function ApplicationForm({ initial = EMPTY_FORM, onSubmit, onCancel, submitLabel = 'Create' }) {
  const [form, setForm] = useState(initial)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.company.trim()) return setFormError('Company is required')
    if (!form.job_title.trim()) return setFormError('Job title is required')
    setSubmitting(true)
    setFormError(null)
    try {
      const payload = { ...form }
      // Strip empty optional strings to null
      ;['job_url', 'location', 'notes', 'job_description', 'applied_at', 'follow_up_at'].forEach((k) => {
        if (!payload[k]) delete payload[k]
      })
      await onSubmit(payload)
    } catch (err) {
      setFormError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Request failed')
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Company *</label>
          <input className={inputClass} style={inputStyle} placeholder="Acme Corp" value={form.company}
            onChange={(e) => set('company', e.target.value)} maxLength={255} />
        </div>
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Job Title *</label>
          <input className={inputClass} style={inputStyle} placeholder="Security Engineer" value={form.job_title}
            onChange={(e) => set('job_title', e.target.value)} maxLength={255} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Location</label>
          <input className={inputClass} style={inputStyle} placeholder="Remote / City" value={form.location}
            onChange={(e) => set('location', e.target.value)} maxLength={255} />
        </div>
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Job URL</label>
          <input className={inputClass} style={inputStyle} placeholder="https://…" value={form.job_url}
            onChange={(e) => set('job_url', e.target.value)} maxLength={2048} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Status</label>
          <select className={inputClass} style={inputStyle} value={form.status} onChange={(e) => set('status', e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Priority</label>
          <select className={inputClass} style={inputStyle} value={form.priority} onChange={(e) => set('priority', e.target.value)}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Source</label>
          <select className={inputClass} style={inputStyle} value={form.source} onChange={(e) => set('source', e.target.value)}>
            {SOURCES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Applied At</label>
          <input type="datetime-local" className={inputClass} style={inputStyle} value={form.applied_at}
            onChange={(e) => set('applied_at', e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">Follow-up At</label>
          <input type="datetime-local" className={inputClass} style={inputStyle} value={form.follow_up_at}
            onChange={(e) => set('follow_up_at', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-zinc-600 block mb-1">Notes</label>
        <textarea className={inputClass} style={inputStyle} placeholder="Recruiter contact, next steps…" rows={2}
          value={form.notes} onChange={(e) => set('notes', e.target.value)} />
      </div>

      <div>
        <label className="text-xs font-mono text-zinc-600 block mb-1">Job Description</label>
        <textarea className={inputClass} style={inputStyle} placeholder="Paste job description…" rows={3}
          value={form.job_description} onChange={(e) => set('job_description', e.target.value)} />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={submitting}
          className="text-xs font-mono px-4 py-2 rounded transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#1e3a8a', color: '#93c5fd' }}>
          {submitting ? `${submitLabel}…` : submitLabel}
        </button>
        <button type="button" onClick={onCancel}
          className="text-xs font-mono px-4 py-2 rounded transition-colors text-zinc-500 hover:text-zinc-300"
          style={{ backgroundColor: '#1a1b22' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function ApplicationRow({ app, onUpdate, onDelete, onEdit }) {
  const [updating, setUpdating] = useState(false)

  async function handleStatusChange(newStatus) {
    setUpdating(true)
    try {
      await onUpdate(app.id, { status: newStatus })
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete application for "${app.job_title}" at "${app.company}"?`)) return
    setUpdating(true)
    try {
      await onDelete(app.id)
    } finally {
      setUpdating(false)
    }
  }

  const isTerminal = app.status === 'rejected' || app.status === 'withdrawn' || app.status === 'offer'
  const followUpOverdue =
    app.follow_up_at && new Date(app.follow_up_at) <= new Date() && !isTerminal

  return (
    <motion.div
      initial={false}
      className="flex items-start gap-4 px-5 py-3.5 group"
      style={{ borderBottom: '1px solid #1e2028' }}
    >
      {/* Priority indicator */}
      <div
        className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: PRIORITY_COLORS[app.priority] }}
        title={`Priority: ${app.priority}`}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-zinc-200 font-medium truncate max-w-xs">
            {app.job_title}
          </span>
          <span className="text-xs text-zinc-500 font-mono">@ {app.company}</span>
          <Badge label={app.status} color={STATUS_COLORS[app.status]} />
          <Badge label={app.source} color={SOURCE_COLORS[app.source]} />
        </div>

        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {app.location && (
            <span className="text-xs font-mono text-zinc-600">{app.location}</span>
          )}
          {app.applied_at && (
            <span className="text-xs font-mono text-zinc-700">
              Applied {new Date(app.applied_at).toLocaleDateString()}
            </span>
          )}
          {app.follow_up_at && (
            <span
              className="text-xs font-mono"
              style={{ color: followUpOverdue ? '#f87171' : '#52525b' }}
            >
              Follow-up {new Date(app.follow_up_at).toLocaleDateString()}
              {followUpOverdue && ' ⚠'}
            </span>
          )}
          {app.notes && (
            <span className="text-xs text-zinc-600 truncate max-w-xs">{app.notes}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {app.job_url && (
          <a
            href={app.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono px-2 py-1 rounded transition-colors text-zinc-500 hover:text-blue-400"
            style={{ backgroundColor: '#1a1b22' }}
            title="Open job URL"
          >
            URL
          </a>
        )}
        <button
          onClick={() => onEdit(app)}
          disabled={updating}
          className="text-[10px] font-mono px-2 py-1 rounded transition-colors text-zinc-500 hover:text-zinc-300 disabled:opacity-40"
          style={{ backgroundColor: '#1a1b22' }}
        >
          Edit
        </button>
        {!isTerminal && (
          <>
            {app.status === 'saved' && (
              <button
                onClick={() => handleStatusChange('applied')}
                disabled={updating}
                className="text-[10px] font-mono px-2 py-1 rounded transition-colors text-zinc-500 hover:text-blue-400 disabled:opacity-40"
                style={{ backgroundColor: '#1a1b22' }}
                title="Mark as applied"
              >
                Applied
              </button>
            )}
            <button
              onClick={() => handleStatusChange('rejected')}
              disabled={updating}
              className="text-[10px] font-mono px-2 py-1 rounded transition-colors text-zinc-500 hover:text-red-400 disabled:opacity-40"
              style={{ backgroundColor: '#1a1b22' }}
              title="Mark as rejected"
            >
              Reject
            </button>
          </>
        )}
        <button
          onClick={handleDelete}
          disabled={updating}
          className="text-[10px] font-mono px-2 py-1 rounded transition-colors text-zinc-500 hover:text-red-400 disabled:opacity-40"
          style={{ backgroundColor: '#1a1b22' }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  )
}

function ListSkeleton() {
  return (
    <div className="px-5 py-3 space-y-3 min-h-[320px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 py-2.5" style={{ borderBottom: i === 5 ? 'none' : '1px solid #1e2028' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1e2028', marginTop: '4px', flexShrink: 0 }} />
          <div className="flex-1 space-y-2">
            <div style={{ width: '38%', height: '12px', borderRadius: '4px', backgroundColor: '#1e2028' }} />
            <div style={{ width: '56%', height: '10px', borderRadius: '4px', backgroundColor: '#1a1b22' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ApplicationsPage() {
  const {
    applications, loading, error, pagination, stats, statsLoading,
    fetchApplications, fetchStats, createApplication, updateApplication, deleteApplication,
  } = useApplications()

  const [showCreate, setShowCreate] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [localFilters, setLocalFilters] = useState({ status: '', priority: '', source: '', search: '' })
  const searchTimeout = useRef(null)

  useEffect(() => {
    fetchApplications(localFilters, 1)
    fetchStats()
  }, [])

  function handleFilterChange(key, val) {
    const next = { ...localFilters, [key]: val }
    setLocalFilters(next)
    if (key === 'search') {
      clearTimeout(searchTimeout.current)
      searchTimeout.current = setTimeout(() => fetchApplications(next, 1), 300)
    } else {
      fetchApplications(next, 1)
    }
  }

  function clearFilters() {
    const reset = { status: '', priority: '', source: '', search: '' }
    setLocalFilters(reset)
    fetchApplications(reset, 1)
  }

  async function handleCreated(payload) {
    await createApplication(payload)
    setShowCreate(false)
    fetchApplications(localFilters, 1)
    fetchStats()
  }

  async function handleEdited(payload) {
    if (!editingApp) return
    await updateApplication(editingApp.id, payload)
    setEditingApp(null)
    fetchApplications(localFilters, pagination.page)
    fetchStats()
  }

  async function handleUpdate(id, updates) {
    try {
      await updateApplication(id, updates)
      fetchApplications(localFilters, pagination.page)
      fetchStats()
    } catch (err) {
      console.error('Failed to update application:', err)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteApplication(id)
      fetchApplications(localFilters, pagination.page)
      fetchStats()
    } catch (err) {
      console.error('Failed to delete application:', err)
    }
  }

  function handleEditStart(app) {
    setShowCreate(false)
    setEditingApp(app)
  }

  const hasFilters = localFilters.status || localFilters.priority || localFilters.source || localFilters.search
  const selectClass = 'text-xs font-mono text-zinc-400 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500'
  const selectStyle = { backgroundColor: '#1a1b22', border: '1px solid #1e2028' }

  const editInitial = editingApp
    ? {
        company: editingApp.company || '',
        job_title: editingApp.job_title || '',
        job_url: editingApp.job_url || '',
        location: editingApp.location || '',
        source: editingApp.source || 'manual',
        status: editingApp.status || 'saved',
        priority: editingApp.priority || 'medium',
        notes: editingApp.notes || '',
        job_description: editingApp.job_description || '',
        applied_at: editingApp.applied_at ? editingApp.applied_at.slice(0, 16) : '',
        follow_up_at: editingApp.follow_up_at ? editingApp.follow_up_at.slice(0, 16) : '',
      }
    : EMPTY_FORM

  return (
    <motion.div initial={false} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-mono text-zinc-300 font-medium">Applications</h1>
          <p className="text-xs text-zinc-600 mt-1">
            {pagination.total} application{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(!showCreate); setEditingApp(null) }}
          className="text-xs font-mono px-3 py-2 rounded transition-colors"
          style={{
            backgroundColor: showCreate ? '#1a1b22' : '#1e3a8a',
            color: showCreate ? '#71717a' : '#93c5fd',
            border: '1px solid #1e2028',
          }}
        >
          {showCreate ? '✕ Cancel' : '+ New Application'}
        </button>
      </div>

      {error && (
        <div className="text-xs font-mono text-red-400 rounded px-4 py-3"
          style={{ backgroundColor: '#1c0a0a', border: '1px solid #450a0a' }}>
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-3">
        <KpiCard label="Total" value={stats.total} accent="#a1a1aa" loading={statsLoading} />
        <KpiCard label="Saved" value={stats.saved} accent={STATUS_COLORS.saved} loading={statsLoading} />
        <KpiCard label="Applied" value={stats.applied} accent={STATUS_COLORS.applied} loading={statsLoading} />
        <KpiCard label="Interviews" value={stats.interviews} accent={STATUS_COLORS.interview} loading={statsLoading} />
        <KpiCard
          label="Follow-ups Due"
          value={stats.followUpsDue}
          accent={stats.followUpsDue > 0 ? '#f87171' : '#52525b'}
          loading={statsLoading}
        />
      </div>

      {/* Create Form */}
      {showCreate && (
        <Card title="New Application">
          <ApplicationForm
            onSubmit={handleCreated}
            onCancel={() => setShowCreate(false)}
            submitLabel="Create Application"
          />
        </Card>
      )}

      {/* Edit Form */}
      {editingApp && (
        <Card title={`Edit: ${editingApp.job_title} @ ${editingApp.company}`}>
          <ApplicationForm
            initial={editInitial}
            onSubmit={handleEdited}
            onCancel={() => setEditingApp(null)}
            submitLabel="Save Changes"
          />
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search company, title, location…"
          value={localFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="text-xs font-mono text-zinc-300 rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
          style={{ backgroundColor: '#1a1b22', border: '1px solid #1e2028', minWidth: '220px' }}
        />
        <select value={localFilters.status} onChange={(e) => handleFilterChange('status', e.target.value)}
          className={selectClass} style={selectStyle}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={localFilters.priority} onChange={(e) => handleFilterChange('priority', e.target.value)}
          className={selectClass} style={selectStyle}>
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={localFilters.source} onChange={(e) => handleFilterChange('source', e.target.value)}
          className={selectClass} style={selectStyle}>
          <option value="">All sources</option>
          {SOURCES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        {hasFilters && (
          <button onClick={clearFilters}
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors">
            Clear filters
          </button>
        )}
      </div>

      {/* List */}
      <Card padding="p-0">
        {loading ? (
          <ListSkeleton />
        ) : applications.length === 0 ? (
          <div className="text-center py-12 min-h-[320px] flex flex-col items-center justify-center">
            <div className="text-xs font-mono text-zinc-600 mb-2">
              {hasFilters ? 'No applications match the current filters' : 'No applications yet'}
            </div>
            {!showCreate && !hasFilters && (
              <button onClick={() => setShowCreate(true)}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors">
                Add your first application →
              </button>
            )}
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onEdit={handleEditStart}
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
                onClick={() => fetchApplications(localFilters, pagination.page - 1)}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-200 disabled:text-zinc-700 disabled:cursor-not-allowed px-2 py-1 rounded"
                style={{ backgroundColor: '#1a1b22' }}
              >
                Prev
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchApplications(localFilters, pagination.page + 1)}
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
