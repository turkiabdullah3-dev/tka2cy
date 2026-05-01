import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function TopBar({ title }) {
  const { user } = useAuth()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
  const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <header
      className="fixed top-0 right-0 flex items-center justify-between px-5 z-20"
      style={{
        left: '220px',
        height: '48px',
        backgroundColor: '#0d0e12',
        borderBottom: '1px solid #1e2028',
      }}
    >
      {/* Left: page title */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-300">{title}</span>
      </div>

      {/* Right: time, live indicator, email */}
      <div className="flex items-center gap-4">
        {/* LIVE indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          <span className="text-xs font-mono text-green-500 tracking-widest">LIVE</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600 font-mono">{dateStr}</span>
          <span
            className="font-mono text-sm tabular-nums"
            style={{ color: '#a1a1aa', letterSpacing: '0.05em' }}
          >
            {timeStr}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-4" style={{ backgroundColor: '#1e2028' }} />

        {/* User email */}
        <span className="text-xs font-mono text-zinc-500 truncate max-w-40">
          {user?.email || 'admin'}
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </header>
  )
}
