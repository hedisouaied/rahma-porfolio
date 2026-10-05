import { useEffect, useRef, useState } from 'react'

/**
 * Tracks which section owns the viewport, and whether the page is scrolled
 * past the fold. Uses a top-biased root margin so the active nav item changes
 * as a section takes over rather than when it is mathematically centred.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node) => node instanceof Element)

    if (!nodes.length) return

    const visible = new Map()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry))
        let best = null
        let bestTop = Infinity
        visible.forEach((entry) => {
          if (!entry.isIntersecting) return
          const top = Math.abs(entry.boundingClientRect.top)
          if (top < bestTop) {
            bestTop = top
            best = entry.target.id
          }
        })
        if (best) setActive(best)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.6] }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [ids])

  return active
}

/** True once the user has moved past `offset` px. */
export function useScrolled(offset = 40) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return scrolled
}

/**
 * Directional scroll state: the nav retracts on the way down and returns on the
 * way up, so it never fights the content but never traps the reader either.
 */
export function useScrollDirection(threshold = 8) {
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - last.current
      if (Math.abs(delta) < threshold) return
      setHidden(delta > 0 && y > 240)
      last.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return hidden
}

/** Matches a media query reactively. */
export function useMedia(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
