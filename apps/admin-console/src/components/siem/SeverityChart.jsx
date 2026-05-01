import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const severityColors = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#3b82f6',
  info:     '#6b7280',
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { severity, count } = payload[0].payload
  return (
    <div
      className="rounded px-3 py-2 text-xs font-mono"
      style={{ backgroundColor: '#0d0e12', border: '1px solid #1e2028', color: '#e4e4e7' }}
    >
      <div className="text-zinc-400 uppercase tracking-wider mb-1">{severity}</div>
      <div className="text-white">{count} events</div>
    </div>
  )
}

export default function SeverityChart({ severityData = [] }) {
  const data = severityData.map((d) => ({
    severity: d.severity || d._id || 'unknown',
    count: d.count || 0,
  }))

  const order = ['critical', 'high', 'medium', 'low', 'info']
  const sorted = [...data].sort((a, b) => {
    const ai = order.indexOf(a.severity)
    const bi = order.indexOf(b.severity)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={sorted} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#1e2028" />
        <XAxis
          dataKey="severity"
          tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v.toUpperCase()}
        />
        <YAxis
          tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={40}>
          {sorted.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={severityColors[entry.severity] || '#6b7280'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
