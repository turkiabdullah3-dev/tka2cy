const selectClass = `
  rounded px-3 py-2 text-sm font-mono text-zinc-300
  transition-colors duration-100 cursor-pointer
  focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-20
`

const selectStyle = {
  backgroundColor: '#141519',
  border: '1px solid #1e2028',
  color: '#d4d4d8',
}

const eventTypes = [
  'login_failed',
  'login_success',
  'brute_force',
  'sql_injection',
  'xss_attempt',
  'csrf_attempt',
  'unauthorized_access',
  'privilege_escalation',
  'port_scan',
  'ddos_attempt',
  'malware_detected',
  'data_exfiltration',
  'config_change',
  'api_abuse',
]

export default function EventFilters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-xs font-mono text-zinc-600 uppercase tracking-widest whitespace-nowrap">Severity</label>
        <select
          value={filters.severity}
          onChange={(e) => handleChange('severity', e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="info">Info</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-mono text-zinc-600 uppercase tracking-widest whitespace-nowrap">Event Type</label>
        <select
          value={filters.event_type}
          onChange={(e) => handleChange('event_type', e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All Types</option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-mono text-zinc-600 uppercase tracking-widest whitespace-nowrap">Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {(filters.severity || filters.event_type || filters.status) && (
        <button
          onClick={() => onChange({ severity: '', event_type: '', status: '' })}
          className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors duration-100 px-2 py-1 rounded hover:bg-zinc-800"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
