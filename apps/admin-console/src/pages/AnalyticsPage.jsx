import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useAnalytics } from '../hooks/useAnalytics'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function KpiCard({ title, value, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="rounded-lg p-5 flex flex-col gap-3"
      style={{ backgroundColor: '#141519', border: '1px solid #1e2028' }}
    >
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{title}</span>
      <div className="text-3xl font-mono font-medium tabular-nums" style={{ color: accent }}>
        {value ?? '—'}
      </div>
    </motion.div>
  )
}

function EventTypeBadge({ type }) {
  const colors = {
    page_view: '#6366f1',
    project_view: '#8b5cf6',
    cv_download: '#22c55e',
    contact_form_submit: '#f59e0b',
    contact_click: '#ec4899',
  }
  const color = colors[type] || '#71717a'
  return (
    <span
      className="text-xs font-mono px-1.5 py-0.5 rounded"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {type}
    </span>
  )
}

const EVENT_TYPES = ['', 'page_view', 'project_view', 'cv_download', 'contact_form_submit', 'contact_click']

export default function AnalyticsPage() {
  const { summary, events, loading, error, pagination, fetchSummary, fetchEvents } = useAnalytics()
  const [eventTypeFilter, setEventTypeFilter] = useState('')
  const [eventsPage, setEventsPage] = useState(1)

  useEffect(() => {
    fetchSummary()
    fetchEvents({ event_type: '', page: 1 })
  }, [])

  function handleFilterChange(e) {
    const val = e.target.value
    setEventTypeFilter(val)
    setEventsPage(1)
    fetchEvents({ event_type: val, page: 1 })
  }

  function handlePageChange(newPage) {
    setEventsPage(newPage)
    fetchEvents({ event_type: eventTypeFilter, page: newPage })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-sm font-mono text-zinc-300 font-medium">Website Analytics</h1>
        <p className="text-xs text-zinc-600 mt-1">Public visitor activity from the portfolio site</p>
      </div>

      {error && (
        <div
          className="text-xs font-mono text-red-400 rounded px-4 py-3"
          style={{ backgroundColor: '#1c0a0a', border: '1px solid #450a0a' }}
        >
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <KpiCard title="Total Events" value={summary?.total ?? (loading ? '…' : 0)} accent="#a1a1aa" index={0} />
        <KpiCard title="Page Views" value={summary?.pageViews ?? (loading ? '…' : 0)} accent="#6366f1" index={1} />
        <KpiCard title="Unique Visitors" value={summary?.uniqueVisitors ?? (loading ? '…' : 0)} accent="#8b5cf6" index={2} />
        <KpiCard title="CV Downloads" value={summary?.cvDownloads ?? (loading ? '…' : 0)} accent="#22c55e" index={3} />
        <KpiCard title="Contact Forms" value={summary?.contactSubmissions ?? (loading ? '…' : 0)} accent="#f59e0b" index={4} />
      </div>

      {/* Page Views Chart */}
      <Card title="Page Views — Last 30 Days">
        {loading && !summary ? (
          <div className="h-48 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        ) : summary?.dailyPageViews?.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.dailyPageViews} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2028" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#52525b', fontFamily: 'monospace' }}
                  tickFormatter={(d) => {
                    const dt = new Date(d)
                    return `${dt.getMonth() + 1}/${dt.getDate()}`
                  }}
                />
                <YAxis tick={{ fontSize: 10, fill: '#52525b', fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141519',
                    border: '1px solid #1e2028',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#a1a1aa',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3, fill: '#6366f1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <span className="text-xs font-mono text-zinc-600">No page view data yet</span>
          </div>
        )}
      </Card>

      {/* Top Pages */}
      <div className="grid grid-cols-2 gap-4">
        <Card title="Top Pages">
          {summary?.topPages?.length > 0 ? (
            <div className="space-y-2">
              {summary.topPages.map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 truncate max-w-[70%]">{row.page}</span>
                  <span className="text-xs font-mono text-zinc-500 tabular-nums">{row.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs font-mono text-zinc-600">No page data yet</span>
          )}
        </Card>

        <Card title="Events by Type">
          {summary?.byType?.length > 0 ? (
            <div className="space-y-2">
              {summary.byType.map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <EventTypeBadge type={row.event_type} />
                  <span className="text-xs font-mono text-zinc-500 tabular-nums">{row.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs font-mono text-zinc-600">No events yet</span>
          )}
        </Card>
      </div>

      {/* Recent Events Table */}
      <Card title="Recent Activity" padding="p-0">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Recent Activity</h2>
          <select
            value={eventTypeFilter}
            onChange={handleFilterChange}
            className="text-xs font-mono text-zinc-400 rounded px-2 py-1 outline-none"
            style={{ backgroundColor: '#1a1b22', border: '1px solid #1e2028' }}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t || 'All types'}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-xs font-mono text-zinc-600">No analytics events yet</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr style={{ borderBottom: '1px solid #1e2028' }}>
                  {['Type', 'Page', 'Visitor', 'Referrer', 'Time'].map((h) => (
                    <th key={h} className="px-5 py-2 text-left text-zinc-600 font-normal uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => (
                  <tr
                    key={ev.id}
                    className="hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: '1px solid #1e2028' }}
                  >
                    <td className="px-5 py-2.5">
                      <EventTypeBadge type={ev.event_type} />
                    </td>
                    <td className="px-5 py-2.5 text-zinc-400 max-w-[160px] truncate">{ev.page || '—'}</td>
                    <td className="px-5 py-2.5 text-zinc-600">{ev.visitor_id ? ev.visitor_id.slice(0, 8) + '…' : '—'}</td>
                    <td className="px-5 py-2.5 text-zinc-600 max-w-[140px] truncate">{ev.referrer || '—'}</td>
                    <td className="px-5 py-2.5 text-zinc-600 whitespace-nowrap">
                      {new Date(ev.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid #1e2028' }}>
            <span className="text-xs font-mono text-zinc-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} events)
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-200 disabled:text-zinc-700 disabled:cursor-not-allowed px-2 py-1 rounded transition-colors"
                style={{ backgroundColor: '#1a1b22' }}
              >
                Prev
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-200 disabled:text-zinc-700 disabled:cursor-not-allowed px-2 py-1 rounded transition-colors"
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
