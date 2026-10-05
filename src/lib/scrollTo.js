import { stage } from './motion'

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Anchor navigation. Uses the shared Lenis instance so a nav click and a
 * wheel flick land in the same scroll system — no double easing, no jump.
 * Falls back to native smooth scrolling when Lenis is off (reduced motion).
 */
export function scrollToId(id) {
  const target = document.getElementById(id)
  if (!target) return

  const header = 76
  const top = target.getBoundingClientRect().top + window.scrollY - (id === 'top' ? 0 : header - 12)

  if (stage.reducedMotion || !stage.lenis) {
    window.scrollTo({ top, behavior: stage.reducedMotion ? 'auto' : 'smooth' })
    return
  }

  stage.lenis.scrollTo(top, { offset: 0, duration: 1.25, easing: easeInOut })
}

export function scrollToTop() {
  if (stage.reducedMotion || !stage.lenis) {
    window.scrollTo({ top: 0, behavior: stage.reducedMotion ? 'auto' : 'smooth' })
    return
  }
  stage.lenis.scrollTo(0, { duration: 1.3, easing: easeInOut })
}
