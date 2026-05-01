import { useRef, useState, useEffect } from 'react'

/**
 * Custom hook for scroll-triggered animations using IntersectionObserver.
 * Returns { ref, isInView } — attach ref to the element you want to observe.
 *
 * @param {Object} options
 * @param {string} [options.margin='-100px'] - Root margin for the observer (threshold offset)
 * @param {boolean} [options.once=true] - Only trigger once when in view
 */
export function useScrollAnimation({ margin = '-100px', once = true } = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsInView(false)
        }
      },
      {
        rootMargin: margin,
        threshold: 0,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [margin, once])

  return { ref, isInView }
}

export default useScrollAnimation
