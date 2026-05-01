import Badge from '../ui/Badge'
import Button from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'
import EmptyState from '../ui/EmptyState'

function formatTimestamp(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export default function EventsTable({ events = [], onResolve, loading }) {
  if (loading) {
    return <LoadingSpinner center size="md" />
  }

  if (!events.length) {
    return (
      <EmptyState
        title="No events found"
        description="No security events match your current filters."
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#141519', borderBottom: '1px solid #1e2028' }}>
            {['Timestamp', 'Type', 'Severity', 'Source IP', 'Path', 'Status', 'Action'].map((col) => (
              <th
                key={col}
                className="text-left px-4 py-3 font-mono text-zinc-500 uppercase tracking-widest text-xs font-medium whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((event, i) => {
            const isEven = i % 2 === 0
            const isOpen = (event.status || '').toLowerCase() === 'open'
            return (
              <tr
                key={event._id || event.id || i}
                className="transition-colors duration-75"
                style={{
                  backgroundColor: isEven ? '#0d0e12' : '#0f1014',
                  borderBottom: '1px solid #1e2028',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a1b22' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isEven ? '#0d0e12' : '#0f1014' }}
              >
                {/* Timestamp */}
                <td className="px-4 py-3 font-mono text-zinc-400 whitespace-nowrap">
                  {formatTimestamp(event.timestamp || event.created_at)}
                </td>

                {/* Type */}
                <td className="px-4 py-3 text-zinc-300 max-w-32 truncate" title={event.event_type}>
                  {event.event_type?.replace(/_/g, ' ') || '—'}
                </td>

                {/* Severity */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge severity={event.severity}>{event.severity}</Badge>
                </td>

                {/* Source IP */}
                <td className="px-4 py-3 font-mono text-zinc-400 max-w-28 truncate" title={event.ip_address || event.source_ip || event.ip}>
                  {event.ip_address || event.source_ip || event.ip || '—'}
                </td>

                {/* Path */}
                <td className="px-4 py-3 font-mono text-zinc-500 max-w-24 truncate" title={event.path}>
                  {event.path || '—'}
                </td>

                {/* Status */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge severity={event.status?.toLowerCase() === 'open' ? 'open' : 'resolved'}>
                    {event.status || '—'}
                  </Badge>
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  {isOpen && onResolve ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResolve(event._id || event.id)}
                    >
                      Resolve
                    </Button>
                  ) : (
                    <span className="text-zinc-700 font-mono">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
