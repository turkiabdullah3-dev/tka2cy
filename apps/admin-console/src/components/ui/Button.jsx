import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary:   'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500',
  danger:    'bg-red-900 hover:bg-red-800 text-red-300 border border-red-800',
  ghost:     'bg-transparent hover:bg-console-hover text-zinc-400 hover:text-zinc-200 border border-transparent',
  secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
}

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded font-medium
        transition-colors duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}
