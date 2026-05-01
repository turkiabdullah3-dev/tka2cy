/**
 * Merge class names — lightweight alternative to clsx/classnames
 * Filters out falsy values and joins with a space.
 */
export function cn(...classes) {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ')
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * Truncate a string to a max length, appending ellipsis.
 */
export function truncate(str, maxLength = 120) {
  if (!str) return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trim() + '…'
}

/**
 * Delay helper for async functions.
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
