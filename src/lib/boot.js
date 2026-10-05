/**
 * Boot coordination. The preloader owns the first paint; sections register a
 * callback and run their entrance once the preloader hands over. Keeping this
 * out of React state means a section can subscribe from any depth without
 * prop-drilling `ready` through the tree.
 */

const listeners = new Set()
let ready = false

export function onReady(fn) {
  if (ready) {
    fn()
    return () => {}
  }
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function markReady() {
  if (ready) return
  ready = true
  const queued = [...listeners]
  listeners.clear()
  queued.forEach((fn) => fn())
}

export const isReady = () => ready
