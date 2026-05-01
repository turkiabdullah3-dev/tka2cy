import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSiem } from '../hooks/useSiem'
import StatsCards from '../components/siem/StatsCards'
import SeverityChart from '../components/siem/SeverityChart'
import EventTypeChart from '../components/siem/EventTypeChart'
import EventsTable from '../components/siem/EventsTable'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function DashboardOverview() {
  const { summary, events, loading, error, fetchSummary, fetchEvents, resolveEvent } = useSiem()

  useEffect(() => {
    fetchSummary()
    fetchEvents({ severity: '', event_type: '', status: 'open' }, 1)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Error banner */}
      {error && (
        <div
          className="text-xs font-mono text-red-400 rounded px-4 py-3"
          style={{ backgroundColor: '#1c0a0a', border: '1px solid #450a0a' }}
        >
          {error}
        </div>
      )}

      {/* Stats */}
      <StatsCards summary={summary} />

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        <Card title="Events by Severity">
          {summary?.bySeverity?.length || summary?.by_severity || summary?.severityBreakdown ? (
            <SeverityChart
              severityData={
                summary.bySeverity ||
                summary.by_severity ||
                summary.severityBreakdown ||
                []
              }
            />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <span className="text-xs font-mono text-zinc-600">No severity data</span>
            </div>
          )}
        </Card>

        <Card title="Top Event Types">
          {summary?.byType?.length || summary?.by_event_type || summary?.eventTypeBreakdown ? (
            <EventTypeChart
              eventTypeData={
                summary.byType ||
                summary.by_event_type ||
                summary.eventTypeBreakdown ||
                []
              }
            />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <span className="text-xs font-mono text-zinc-600">No event type data</span>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Events */}
      <Card title="Recent Open Events" padding="p-0">
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Recent Open Events</h2>
            <a
              href="/security/siem"
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors duration-100"
            >
              View all →
            </a>
          </div>
        </div>
        <EventsTable
          events={events.slice(0, 10)}
          onResolve={resolveEvent}
          loading={loading}
        />
      </Card>
    </motion.div>
  )
}
