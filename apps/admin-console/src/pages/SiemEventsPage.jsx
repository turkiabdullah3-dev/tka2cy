import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSiem } from '../hooks/useSiem'
import EventFilters from '../components/siem/EventFilters'
import EventsTable from '../components/siem/EventsTable'
import Pagination from '../components/ui/Pagination'
import Card from '../components/ui/Card'

export default function SiemEventsPage() {
  const {
    events,
    loading,
    error,
    pagination,
    filters,
    fetchEvents,
    resolveEvent,
    updateFilters,
  } = useSiem()

  useEffect(() => {
    fetchEvents(filters, 1)
  }, [])

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters)
    fetchEvents(newFilters, 1)
  }

  const handlePageChange = (page) => {
    fetchEvents(filters, page)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Filters */}
      <div
        className="rounded-lg px-5 py-4"
        style={{ backgroundColor: '#141519', border: '1px solid #1e2028' }}
      >
        <EventFilters filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Error */}
      {error && (
        <div
          className="text-xs font-mono text-red-400 rounded px-4 py-3"
          style={{ backgroundColor: '#1c0a0a', border: '1px solid #450a0a' }}
        >
          {error}
        </div>
      )}

      {/* Table */}
      <Card padding="p-0">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2028' }}>
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Security Events</h2>
            {!loading && (
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: '#1e2028', color: '#71717a' }}
              >
                {pagination.total} total
              </span>
            )}
          </div>
          <button
            onClick={() => fetchEvents(filters, pagination.page)}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors duration-100 px-2 py-1 rounded hover:bg-zinc-800 flex items-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 6a4 4 0 1 1-1.17-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 2v2.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
        </div>

        <EventsTable
          events={events}
          onResolve={resolveEvent}
          loading={loading}
        />

        {!loading && events.length > 0 && (
          <div className="px-5 pb-5">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>
    </motion.div>
  )
}
