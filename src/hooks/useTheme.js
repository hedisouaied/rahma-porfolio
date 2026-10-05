import { useCallback, useEffect, useState } from 'react'

const KEY = 'theme'
const getInitial = () => {
  if (typeof document === 'undefined') return 'dark'
  const attr = document.documentElement.dataset.theme
  return attr === 'light' ? 'light' : 'dark'
}

/**
 * Theme with a circular view-transition wipe anchored at the toggle, so
 * switching feels like a light box opening rather than a repaint.
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitial)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* storage unavailable — in-memory only */
    }
  }, [theme])

  const toggle = useCallback(
    (origin) => {
      setTheme((current) => {
        const next = current === 'dark' ? 'light' : 'dark'

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const supported =
          typeof document.startViewTransition === 'function' && !reduced && origin?.getBoundingClientRect

        if (!supported) return next

        const rect = origin.getBoundingClientRect()
        const x = `${rect.left + rect.width / 2}px`
        const y = `${rect.top + rect.height / 2}px`

        document.documentElement.style.setProperty('--vt-x', x)
        document.documentElement.style.setProperty('--vt-y', y)

        document.startViewTransition(() => {
          document.documentElement.dataset.theme = next
        })

        return next
      })
    },
    []
  )

  return { theme, toggle }
}
