import React from 'react'
import { cn } from '../../lib/utils'

const variantStyles = {
  default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  success: 'bg-emerald-950 text-emerald-400 border border-emerald-900',
  warning: 'bg-amber-950 text-amber-400 border border-amber-900',
  danger: 'bg-red-950 text-red-400 border border-red-900',
  security: 'bg-red-900/40 text-red-300 border border-red-800/50',
  info: 'bg-blue-950 text-blue-400 border border-blue-900',
  active: 'bg-emerald-950 text-emerald-400 border border-emerald-900',
  concept: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
  development: 'bg-blue-950 text-blue-400 border border-blue-900',
  research: 'bg-purple-950 text-purple-400 border border-purple-900',
}

export default function Badge({ variant = 'default', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm font-mono tracking-wide',
        variantStyles[variant] || variantStyles.default,
        className
      )}
    >
      {children}
    </span>
  )
}
