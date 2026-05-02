import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useJobIntelligence } from '../hooks/useJobIntelligence'
import { useApplications } from '../hooks/useApplications'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// ─── colour maps ────────────────────────────────────────────

const FIT_COLORS = {
  weak: '#ef4444',
  moderate: '#f59e0b',
  strong: '#3b82f6',
  excellent: '#22c55e',
}

const REC_COLORS = {
  apply: '#22c55e',
  apply_after_cv_update: '#3b82f6',
  skip: '#ef4444',
  save_for_later: '#f59e0b',
}

const REC_LABELS = {
  apply: 'Apply',
  apply_after_cv_update: 'Apply after CV update',
  skip: 'Skip',
  save_for_later: 'Save for later',
}

// ─── helpers ────────────────────────────────────────────────

function FitBadge({ level }) {
  if (!level) return null
  return (
    <span
      className="text-xs font-mono px-1.5 py-0.5 rounded capitalize"
      style={{ backgroundColor: `${FIT_COLORS[level]}20`, color: FIT_COLORS[level] }}
    >
      {level}
    </span>
  )
}

function RecBadge({ rec }) {
  if (!rec) return null
  return (
    <span
      className="text-xs font-mono px-1.5 py-0.5 rounded"
      style={{ backgroundColor: `${REC_COLORS[rec]}20`, color: REC_COLORS[rec] }}
    >
      {REC_LABELS[rec] || rec}
    </span>
  )
}

function ScoreBar({ score }) {
  const color = score >= 70 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: '6px', backgroundColor: '#1e2028' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-mono font-medium flex-shrink-0" style={{ color, minWidth: '36px' }}>
        {score}%
      </span>
    </div>
  )
}

function ListSection({ title, items, emptyText, bulletColor }) {
  if (!items || items.length === 0) {
    return (
      <div>
        <p className="text-xs font-mono text-zinc-600 mb-2">{title}</p>
        <p className="text-xs font-mono text-zinc-700 italic">{emptyText || 'None'}</p>
      </div>
    )
  }
  return (
    <div>
      <p className="text-xs font-mono text-zinc-600 mb-2">{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs font-mono text-zinc-300">
            <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: bulletColor || '#52525b' }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── analysis result panel ──────────────────────────────────

function AnalysisResult({ analysis, onDismiss }) {
  const isMock = analysis.warnings?.some((w) => w.includes('MOCK') || w.includes('mock'))

  return (
    <Card title="Analysis Result">
      {isMock && (
        <div
          className="text-xs font-mono px-3 py-2 rounded mb-4"
          style={{ backgroundColor: '#1c1200', border: '1px solid #78350f', color: '#fbbf24' }}
        >
          DEV/MOCK MODE — No AI key configured. This is simulated output, not a real analysis.
        </div>
      )}

      {analysis.prompt_injection_signal && (
        <div
          className="text-xs font-mono px-3 py-2 rounded mb-4"
          style={{ backgroundColor: '#1c0a0a', border: '1px solid #7f1d1d', color: '#f87171' }}
        >
          Prompt injection signal detected in the job description. Analysis was still run; treat results with caution.
        </div>
      )}

      {/* Score + fit + recommendation */}
      <div className="space-y-3 mb-5">
        <div>
          <p className="text-xs font-mono text-zinc-600 mb-1.5">Match Score</p>
          <ScoreBar score={analysis.match_score ?? 0} />
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-mono text-zinc-600 mb-1">Fit Level</p>
            <FitBadge level={analysis.fit_level} />
          </div>
          <div>
            <p className="text-xs font-mono text-zinc-600 mb-1">Recommendation</p>
            <RecBadge rec={analysis.recommendation} />
          </div>
          {analysis.model_used && (
            <div className="ml-auto">
              <span className="text-[10px] font-mono text-zinc-700">{analysis.model_used}</span>
            </div>
          )}
        </div>
      </div>

      {/* Reasoning */}
      {analysis.reasoning && (
        <div className="mb-5">
          <p className="text-xs font-mono text-zinc-600 mb-1.5">Reasoning</p>
          <p className="text-xs text-zinc-400 leading-relaxed">{analysis.reasoning}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-3">
        <ListSection
          title="Strengths"
          items={analysis.strengths}
          emptyText="No matching strengths identified"
          bulletColor="#22c55e"
        />
        <ListSection
          title="Missing Skills"
          items={analysis.missing_skills}
          emptyText="No major gaps identified"
          bulletColor="#ef4444"
        />
        <ListSection
          title="CV Suggestions"
          items={analysis.cv_suggestions}
          emptyText="No suggestions"
          bulletColor="#3b82f6"
        />
      </div>

      {/* Warnings */}
      {analysis.warnings && analysis.warnings.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-mono text-zinc-600 mb-1.5">Warnings</p>
          <ul className="space-y-1">
            {analysis.warnings.map((w, i) => (
              <li key={i} className="text-xs font-mono text-amber-500">⚠ {w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid #1e2028' }}>
        <button
          onClick={onDismiss}
          className="text-xs font-mono px-3 py-1.5 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
          style={{ backgroundColor: '#1a1b22' }}
        >
          Dismiss
        </button>
      </div>
    </Card>
  )
}

// ─── analyse form ────────────────────────────────────────────

function AnalyzeForm({ applications, analyzing, analyzeError, onSubmit, onClearError }) {
  const [mode, setMode] = useState('paste') // 'paste' | 'linked'
  const [jobDescription, setJobDescription] = useState('')
  const [selectedAppId, setSelectedAppId] = useState('')
  const [linkedAppDesc, setLinkedAppDesc] = useState('')

  function handleAppSelect(e) {
    const appId = e.target.value
    setSelectedAppId(appId)
    if (appId) {
      const app = applications.find((a) => a.id === appId)
      setLinkedAppDesc(app?.job_description || '')
    } else {
      setLinkedAppDesc('')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    onClearError()
    const desc = mode === 'linked' ? linkedAppDesc : jobDescription
    if (!desc.trim()) return
    await onSubmit({
      job_description: desc,
      application_id: mode === 'linked' ? selectedAppId || null : null,
    })
  }

  const inputClass = 'w-full text-xs font-mono text-zinc-300 rounded px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500'
  const inputStyle = { backgroundColor: '#0d0e12', border: '1px solid #1e2028' }
  const charCount = (mode === 'linked' ? linkedAppDesc : jobDescription).length

  return (
    <Card title="Analyze a Job">
      {/* Mode tabs */}
      <div className="flex gap-1 mb-4">
        {[
          { key: 'paste', label: 'Paste job description' },
          { key: 'linked', label: 'Link to application' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className="text-xs font-mono px-3 py-1.5 rounded transition-colors"
            style={{
              backgroundColor: mode === key ? '#1e3a8a' : '#1a1b22',
              color: mode === key ? '#93c5fd' : '#52525b',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {analyzeError && (
          <div
            className="text-xs font-mono text-red-400 px-3 py-2 rounded"
            style={{ backgroundColor: '#1c0a0a', border: '1px solid #450a0a' }}
          >
            {analyzeError}
          </div>
        )}

        {mode === 'linked' && (
          <div>
            <label className="text-xs font-mono text-zinc-600 block mb-1">Select Application</label>
            <select
              className={inputClass}
              style={inputStyle}
              value={selectedAppId}
              onChange={handleAppSelect}
            >
              <option value="">— pick an application —</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.job_title} @ {app.company}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs font-mono text-zinc-600 block mb-1">
            Job Description{' '}
            <span style={{ color: charCount > 38000 ? '#f87171' : '#3f3f46' }}>
              ({charCount.toLocaleString()} / 40,000)
            </span>
          </label>
          <textarea
            className={inputClass}
            style={inputStyle}
            rows={mode === 'linked' && selectedAppId ? 6 : 12}
            placeholder={
              mode === 'linked' && !selectedAppId
                ? 'Select an application above to auto-fill its job description, or paste manually here…'
                : 'Paste the full job description here…'
            }
            value={mode === 'linked' ? linkedAppDesc : jobDescription}
            onChange={(e) => {
              if (mode === 'linked') setLinkedAppDesc(e.target.value)
              else setJobDescription(e.target.value)
            }}
            maxLength={40000}
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={
              analyzing ||
              (mode === 'linked' ? linkedAppDesc.trim().length < 10 : jobDescription.trim().length < 10)
            }
            className="text-xs font-mono px-4 py-2 rounded transition-colors disabled:opacity-40"
            style={{ backgroundColor: '#1e3a8a', color: '#93c5fd' }}
          >
            {analyzing ? 'Analyzing…' : 'Analyze Job'}
          </button>
          {analyzing && <LoadingSpinner size="sm" />}
          <span className="text-xs font-mono text-zinc-700">
            Results are AI-generated. Always verify before applying.
          </span>
        </div>
      </form>
    </Card>
  )
}

// ─── history row ─────────────────────────────────────────────

function HistoryRow({ item, onDelete, onView }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this analysis?')) return
    setDeleting(true)
    try {
      await onDelete(item.id)
    } finally {
      setDeleting(false)
    }
  }

  const label = item.app_company
    ? `${item.app_job_title || 'Unknown role'} @ ${item.app_company}`
    : `Analysis ${item.id.slice(0, 8)}`

  return (
    <div
      className="flex items-center gap-4 px-5 py-3 group"
      style={{ borderBottom: '1px solid #1e2028' }}
    >
      {/* Status dot */}
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          backgroundColor:
            item.status === 'analyzed'
              ? FIT_COLORS[item.fit_level] || '#52525b'
              : item.status === 'failed'
              ? '#ef4444'
              : '#52525b',
        }}
        title={`Status: ${item.status}`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-zinc-200 font-mono truncate max-w-xs">{label}</span>
          {item.status === 'analyzed' && (
            <>
              <FitBadge level={item.fit_level} />
              <RecBadge rec={item.recommendation} />
              {item.match_score != null && (
                <span className="text-xs font-mono text-zinc-600">{item.match_score}%</span>
              )}
            </>
          )}
          {item.status === 'failed' && (
            <span className="text-xs font-mono text-red-500">Analysis failed</span>
          )}
          {item.status === 'draft' && (
            <span className="text-xs font-mono text-zinc-600">Draft</span>
          )}
          {item.prompt_injection_signal && (
            <span className="text-xs font-mono text-amber-500" title="Prompt injection signal detected">⚠ injection signal</span>
          )}
        </div>
        <div className="text-xs font-mono text-zinc-700 mt-0.5">
          {new Date(item.created_at).toLocaleString()}
          {item.model_used && ` · ${item.model_used}`}
        </div>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {item.status === 'analyzed' && (
          <button
            onClick={() => onView(item)}
            className="text-[10px] font-mono px-2 py-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
            style={{ backgroundColor: '#1a1b22' }}
          >
            View
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-[10px] font-mono px-2 py-1 rounded text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-40"
          style={{ backgroundColor: '#1a1b22' }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

// ─── page ────────────────────────────────────────────────────

const FIT_LEVELS = ['weak', 'moderate', 'strong', 'excellent']
const RECOMMENDATIONS = ['apply', 'apply_after_cv_update', 'skip', 'save_for_later']

export default function JobIntelligencePage() {
  const {
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
  } = useJobIntelligence()

  const { applications, fetchApplications } = useApplications()

  const [filters, setFilters] = useState({ fit_level: '', recommendation: '' })
  const [latestResult, setLatestResult] = useState(null)
  const [viewingAnalysis, setViewingAnalysis] = useState(null)

  useEffect(() => {
    fetchAnalyses({}, 1)
    fetchApplications({}, 1)
  }, [])

  function handleFilterChange(key, val) {
    const next = { ...filters, [key]: val }
    setFilters(next)
    fetchAnalyses(next, 1)
  }

  function clearFilters() {
    const reset = { fit_level: '', recommendation: '' }
    setFilters(reset)
    fetchAnalyses(reset, 1)
  }

  async function handleAnalyze(payload) {
    const result = await analyze(payload)
    if (result) {
      setLatestResult(result)
      setViewingAnalysis(null)
      fetchAnalyses(filters, 1)
    }
  }

  async function handleDelete(id) {
    await deleteAnalysis(id)
    if (latestResult?.id === id) setLatestResult(null)
    if (viewingAnalysis?.id === id) setViewingAnalysis(null)
    fetchAnalyses(filters, pagination.page)
  }

  const hasFilters = filters.fit_level || filters.recommendation
  const selectStyle = { backgroundColor: '#1a1b22', border: '1px solid #1e2028' }
  const selectClass = 'text-xs font-mono text-zinc-400 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500'

  const displayedResult = viewingAnalysis || latestResult

  return (
    <motion.div initial={false} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-sm font-mono text-zinc-300 font-medium">Job Intelligence</h1>
        <p className="text-xs text-zinc-600 mt-1">
          AI-assisted analysis of job descriptions matched against your profile. Analysis only — no auto-apply.
        </p>
      </div>

      {error && (
        <div
          className="text-xs font-mono text-red-400 rounded px-4 py-3"
          style={{ backgroundColor: '#1c0a0a', border: '1px solid #450a0a' }}
        >
          {error}
        </div>
      )}

      {/* Analyze form */}
      <AnalyzeForm
        applications={applications}
        analyzing={analyzing}
        analyzeError={analyzeError}
        onSubmit={handleAnalyze}
        onClearError={clearAnalyzeError}
      />

      {/* Result panel */}
      {displayedResult && (
        <AnalysisResult
          analysis={displayedResult}
          onDismiss={() => {
            setLatestResult(null)
            setViewingAnalysis(null)
          }}
        />
      )}

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-xs font-mono text-zinc-500 font-medium">
            History — {pagination.total} analysis{pagination.total !== 1 ? 'es' : ''}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filters.fit_level}
              onChange={(e) => handleFilterChange('fit_level', e.target.value)}
              className={selectClass}
              style={selectStyle}
            >
              <option value="">All fit levels</option>
              {FIT_LEVELS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select
              value={filters.recommendation}
              onChange={(e) => handleFilterChange('recommendation', e.target.value)}
              className={selectClass}
              style={selectStyle}
            >
              <option value="">All recommendations</option>
              {RECOMMENDATIONS.map((r) => (
                <option key={r} value={r}>{REC_LABELS[r]}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <Card padding="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 min-h-[200px]">
              <LoadingSpinner />
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12 min-h-[200px] flex flex-col items-center justify-center">
              <p className="text-xs font-mono text-zinc-600">
                {hasFilters ? 'No analyses match the current filters' : 'No analyses yet'}
              </p>
              {!hasFilters && (
                <p className="text-xs font-mono text-zinc-700 mt-1">
                  Paste a job description above and click Analyze Job
                </p>
              )}
            </div>
          ) : (
            analyses.map((item) => (
              <HistoryRow
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onView={(a) => {
                  setViewingAnalysis(a)
                  setLatestResult(null)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            ))
          )}

          {pagination.totalPages > 1 && (
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: '1px solid #1e2028' }}
            >
              <span className="text-xs font-mono text-zinc-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchAnalyses(filters, pagination.page - 1)}
                  className="text-xs font-mono text-zinc-400 hover:text-zinc-200 disabled:text-zinc-700 disabled:cursor-not-allowed px-2 py-1 rounded"
                  style={{ backgroundColor: '#1a1b22' }}
                >
                  Prev
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchAnalyses(filters, pagination.page + 1)}
                  className="text-xs font-mono text-zinc-400 hover:text-zinc-200 disabled:text-zinc-700 disabled:cursor-not-allowed px-2 py-1 rounded"
                  style={{ backgroundColor: '#1a1b22' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  )
}
