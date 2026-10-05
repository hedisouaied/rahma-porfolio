import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import '../styles/thesis.css'

/**
 * The thesis. Two stacked text fills are clipped by background-size: a bright
 * fill that wipes left-to-right over a muted one, scrubbed by scroll. The
 * gradient is clipped to the glyphs, so the type appears to be inked on.
 */
export default function Thesis() {
  const root = useRef(null)

  useEffect(() => {
    if (reducedMotion()) {
      gsap.set('.thesis-text', { backgroundSize: '100% 100%, 100% 100%' })
      return undefined
    }

    const tween = gsap.fromTo(
      '.thesis-text',
      { backgroundSize: '0% 100%, 100% 100%' },
      {
        backgroundSize: '100% 100%, 100% 100%',
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: true,
        },
      }
    )

    return () => tween.kill()
  }, [])

  return (
    <section className="thesis wrap" ref={root} aria-label="Professional thesis">
      <p className="thesis-text">
        Turning raw data into <em>decisions</em> <span className="dim">that move revenue.</span>
      </p>
    </section>
  )
}
