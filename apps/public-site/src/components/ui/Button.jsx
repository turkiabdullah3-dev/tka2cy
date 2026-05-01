import React from 'react'
import { cn } from '../../lib/utils'

const variantStyles = {
  primary: 'bg-white text-black hover:bg-zinc-200 border border-white',
  outline: 'bg-transparent text-white border border-white hover:bg-white hover:text-black',
  ghost: 'bg-transparent text-zinc-400 border border-transparent hover:text-white hover:border-zinc-700',
}

const sizeStyles = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-sm transition-all duration-200 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
