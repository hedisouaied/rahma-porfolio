import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/* Easings tuned to feel expensive: fast departure, long soft landing. */
export const EASE = {
  out: 'expo.out',
  soft: 'power3.out',
  smooth: 'power4.out',
  drift: 'sine.inOut',
}

export const DURATION = {
  fast: 0.5,
  base: 0.8,
  slow: 1.15,
  reveal: 1,
  curtain: 1.05,
}

/* Shared, framework-agnostic state the scroll scenes read and write. */
export const stage = {
  reducedMotion: false,
  lenis: null,
  pipeline: 0,
  thesis: 1,
  progress: 0,
  pointer: { x: 0, y: 0, active: false, fine: false },
}

/* ------------------------------------------------------------------ motion -- */

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const reducedMotion = prefersReduced

/**
 * Smooth scrolling. Lenis drives GSAP's ticker so ScrollTrigger and the
 * smooth scroll share a single rAF loop and never disagree about position.
 * Disabled entirely when the visitor asks for reduced motion.
 */
export function createSmoothScroll() {
  if (prefersReduced()) {
    stage.reducedMotion = true
    stage.lenis = null
    document.documentElement.classList.remove('lenis', 'lenis-smooth')
    return { lenis: null, destroy: () => {}, stop: () => {}, start: () => {} }
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
    syncTouch: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  stage.lenis = lenis

  return {
    lenis,
    stop: () => lenis.stop(),
    start: () => lenis.start(),
    destroy: () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    },
  }
}

export { gsap, ScrollTrigger }

/* ----------------------------------------------------------------- helpers -- */

export const clamp01 = (v) => Math.min(1, Math.max(0, v))

/** Smoothstep — used everywhere a raw scroll progress needs softening. */
export const smoothstep = (edge0, edge1, x) => {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** Split a string into words for staggered reveals, preserving spaces. */
export const splitWords = (text) => text.split(' ')

/** Build the intro timeline. Called once, after the preloader hands over. */
export function refreshScroll() {
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

export function invalidateScroll() {
  ScrollTrigger.refresh()
}
