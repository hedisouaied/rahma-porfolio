/** Shared, ref-counted scroll lock. Lenis stays in charge; we only toggle it. */

let lockCount = 0
let lenisRef = null

export function registerLenis(instance) {
  lenisRef = instance
}

export function lockScroll() {
  lockCount += 1
  if (lockCount === 1) {
    lenisRef?.stop()
    document.documentElement.classList.add('is-locked')
  }
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    lenisRef?.start()
    document.documentElement.classList.remove('is-locked')
  }
}
