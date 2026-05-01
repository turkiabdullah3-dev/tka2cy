import { motion } from 'framer-motion'

function StatCard({ title, value, description, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="rounded-lg p-5 flex flex-col gap-3"
      style={{
        backgroundColor: '#141519',
        border: '1px solid #1e2028',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{title}</span>
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
      <div
        className="text-3xl font-mono font-medium tabular-nums"
        style={{ color: accent }}
      >
        {value ?? '—'}
      </div>
      {description && (
        <div className="text-xs text-zinc-600">{description}</div>
      )}
    </motion.div>
  )
}

export default function StatsCards({ summary }) {
  const total = summary?.total ?? 0
  const statusCounts = summary?.statusCounts ?? {}
  const severityCounts = Object.fromEntries(
    (summary?.bySeverity ?? []).map(({ severity, count }) => [severity, count])
  )
  const open = statusCounts.open ?? summary?.open ?? 0
  const resolved = statusCounts.resolved ?? summary?.resolved ?? 0
  const critical = (severityCounts.critical ?? summary?.critical ?? 0) + (severityCounts.high ?? summary?.high ?? 0)

  const cards = [
    {
      title: 'Total Events',
      value: total,
      description: 'All recorded security events',
      accent: '#a1a1aa',
    },
    {
      title: 'Open Events',
      value: open,
      description: 'Awaiting triage or resolution',
      accent: '#fbbf24',
    },
    {
      title: 'Critical / High',
      value: critical,
      description: 'High-priority threats detected',
      accent: '#f87171',
    },
    {
      title: 'Resolved',
      value: resolved,
      description: 'Events closed and archived',
      accent: '#4ade80',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <StatCard key={card.title} {...card} index={i} />
      ))}
    </div>
  )
}
