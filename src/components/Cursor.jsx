import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import { onReady } from '../lib/boot'

const LABELS = {
  link: 'View',
  mail: 'Write',
  call: 'Call',
  cv: 'PDF',
  flip: 'Flip',
  drag: 'Drag',
}

/**
 * A two-part pointer: an instant dot and a lagging ring that inflates into an
 * accent disc carrying a contextual label over anything interactive.
 * Pointer-fine devices only — on touch it never mounts, so mobile keeps the
 * platform's own affordances.
 */
export default function Cursor() {
  const root = useRef(null)
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    const el = root.current
    if (!el) return undefined

    const setVisible = (on) => el.setAttribute('data-visible', on ? 'true' : 'false')
    const setHover = (label) => el.setAttribute('data-hover', label ? 'true' : 'false')
    const label = el.querySelector('.cursor-ring b')

    const quick = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const slow = { ...quick }

    const onMove = (event) => {
      quick.x = event.clientX
      quick.y = event.clientY
      setVisible(true)

      const target = event.target instanceof Element ? event.target : null
      const hit = target?.closest('a, button, [data-cursor]')
      const key = hit ? hit.getAttribute('data-cursor') || 'link' : null
      if (label) label.textContent = LABELS[key] || 'Open'
      setHover(key)
    }

    const onLeave = () => setVisible(false)

    const follow = () => {
      slow.x += (quick.x - slow.x) * 0.16
      slow.y += (quick.y - slow.y) * 0.16
      if (dot.current) gsap.set(dot.current, { x: quick.x, y: quick.y })
      if (ring.current) gsap.set(ring.current, { x: slow.x, y: slow.y })
    }

    gsap.ticker.add(follow)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)

    const stop = onReady(() => {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' })
    })

    return () => {
      stop()
      gsap.ticker.remove(follow)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  return (
    <div className="cursor-root" ref={root} data-visible="false" data-hover="false" aria-hidden="true">
      <span className="cursor-ring" ref={ring}>
        <b />
      </span>
      <span className="cursor-dot" ref={dot} />
    </div>
  )
}
