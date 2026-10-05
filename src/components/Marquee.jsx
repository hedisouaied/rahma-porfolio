import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import '../styles/ui.css'

/**
 * Continuous, low-contrast keyword strip. Gives the scroll a lateral rhythm
 * between two heavy blocks without pulling focus. Duplicated groups make the
 * loop seamless; the transform is driven by a single scrubbed tween.
 */
export default function Marquee({ items, speed = 34 }) {
  const track = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return undefined
    const node = track.current
    if (!node) return undefined

    const half = node.scrollWidth / 2
    if (!half) return undefined

    const tween = gsap.fromTo(
      node,
      { x: 0 },
      {
        x: -half,
        duration: half / speed,
        ease: 'none',
        repeat: -1,
      }
    )

    return () => tween.kill()
  }, [speed, items])

  const group = (key) => (
    <div className="marquee-group" key={key} aria-hidden={key === 'b' ? 'true' : undefined}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  )

  return (
    <div className="marquee" aria-label={items.join(', ')}>
      <div className="marquee-track" ref={track}>
        {group('a')}
        {group('b')}
      </div>
    </div>
  )
}
