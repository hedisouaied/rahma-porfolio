import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion, EASE } from '../lib/motion'
import { award } from '../data/profile'
import '../styles/award.css'

/**
 * The milestone. The year arrives oversized and hollow, the rule draws across,
 * then the award name resolves from below. Scroll position also lights the year
 * in accent, so arriving at the section completes the moment.
 */
export default function Award() {
  const root = useRef(null)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    if (reducedMotion()) {
      setLit(true)
      return undefined
    }

    const node = root.current
    if (!node) return undefined

    gsap.set('.award-year span', { yPercent: 108 })
    gsap.set('.award-title span', { yPercent: 60, opacity: 0 })
    gsap.set('.award-kicker, .award-seal, .award-note', { opacity: 0, y: 16 })
    gsap.set('.award-rule', { scaleX: 0.2, opacity: 0 })
    gsap.set('.award-rule i', { scaleX: 0 })

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: node, start: 'top 68%', once: true },
      defaults: { ease: EASE.out },
    })

    timeline
      .to('.award-kicker', { opacity: 1, y: 0, duration: 0.7 }, 0)
      .to('.award-year span', { yPercent: 0, duration: 1.5, ease: 'expo.out' }, 0.05)
      .to('.award-rule', { scaleX: 1, opacity: 1, duration: 1 }, 0.5)
      .to('.award-rule i', { scaleX: 1, duration: 1.1, ease: 'expo.inOut' }, 0.55)
      .to(
        '.award-title span',
        { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.11 },
        0.7
      )
      .to('.award-note', { opacity: 1, y: 0, duration: 0.9 }, 1.15)
      .to('.award-seal', { opacity: 1, y: 0, duration: 0.8 }, 1.3)
      .add(() => setLit(true))

    /* Parallax drift on the numeral, and a slow breathing glow. */
    const drift = gsap.to('.award-year', {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true },
    })

    const glow = gsap.to('.award-glow', {
      opacity: 0.34,
      scale: 1.14,
      duration: 3.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    return () => {
      timeline.kill()
      drift.kill()
      glow.kill()
    }
  }, [])

  return (
    <section className="award" id="award" ref={root} data-lit={lit} aria-labelledby="award-title">
      <span className="award-grid" aria-hidden="true" />
      <span className="award-glow" aria-hidden="true" />

      <div className="award-inner wrap">
        <p className="award-kicker">
          <span className="eyebrow-line" aria-hidden="true" />
          {award.kicker}
        </p>

        <p className="award-year" aria-hidden="true">
          <span>{award.year}</span>
        </p>

        <div className="award-rule" aria-hidden="true">
          <i />
        </div>

        <h2 className="award-title" id="award-title">
          {award.title.map((line) => (
            <span key={line}>
              {line}
              {' '}
            </span>
          ))}
        </h2>

        <p className="sr-only">
          In {award.year}, Rahma Jlassi was recognised as Best Business Analyst of the Year.
        </p>

        <p className="award-note">{award.note}</p>

        <p className="award-seal">
          <b aria-hidden="true">★</b>
          {award.year} · {award.title.join(' ')}
        </p>
      </div>
    </section>
  )
}
