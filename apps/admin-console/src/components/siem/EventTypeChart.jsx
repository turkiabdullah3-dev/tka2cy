import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { event_type, count } = payload[0].payload
  return (
    <div
      className="rounded px-3 py-2 text-xs font-mono"
      style={{ backgroundColor: '#0d0e12', border: '1px solid #1e2028', color: '#e4e4e7' }}
    >
      <div className="text-zinc-400 mb-1">{event_type}</div>
      <div className="text-white">{count} events</div>
    </div>
  )
}

export default function EventTypeChart({ eventTypeData = [] }) {
  const data = eventTypeData
    .map((d) => ({
      event_type: d.event_type || d._id || 'unknown',
      count: d.count || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const BAR_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#4f46e5', '#7c3aed', '#6d28d9']

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} stroke="#1e2028" />
        <XAxis
          type="number"
          tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          dataKey="event_type"
          type="category"
          width={110}
          tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v.replace(/_/g, ' ')}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={20}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
