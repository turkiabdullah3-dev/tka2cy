const variantStyles = {
  critical: { backgroundColor: '#450a0a', color: '#f87171', borderColor: '#7f1d1d' },
  high:     { backgroundColor: '#431407', color: '#fb923c', borderColor: '#7c2d12' },
  medium:   { backgroundColor: '#422006', color: '#facc15', borderColor: '#713f12' },
  low:      { backgroundColor: '#172554', color: '#60a5fa', borderColor: '#1e3a8a' },
  info:     { backgroundColor: '#18181b', color: '#a1a1aa', borderColor: '#27272a' },
  open:     { backgroundColor: '#451a03', color: '#fbbf24', borderColor: '#78350f' },
  resolved: { backgroundColor: '#052e16', color: '#4ade80', borderColor: '#14532d' },
}

export default function Badge({ severity, children }) {
  const key = (severity || '').toLowerCase()
  const style = variantStyles[key] || variantStyles.info

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider border"
      style={style}
    >
      {children || severity}
    </span>
  )
}
