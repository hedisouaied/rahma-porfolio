import { useEffect, useRef, useState } from 'react'
import { gsap, stage, DURATION, EASE, reducedMotion } from '../lib/motion'
import { markReady } from '../lib/boot'
import { identity } from '../data/profile'
import '../styles/preloader.css'

const SEQUENCE = [
  { idx: '01', label: 'DATA' },
  { idx: '02', label: 'ANALYSIS' },
  { idx: '03', label: 'INSIGHT' },
]

const RETURNING_KEY = 'rj:seen'

/**
 * Typematic overture. Three words resolve in sequence while a hairline fills,
 * then a four-panel curtain lifts to hand over to the hero entrance.
 * Returning visitors in the same session get a shortened version.
 */
export default function Preloader() {
  const root = useRef(null)
  const [step, setStep] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const returning =
      typeof sessionStorage !== 'undefined' && sessionStorage.getItem(RETURNING_KEY) === '1'
    const fill = returning ? 0.5 : 0.9

    try {
      sessionStorage.setItem(RETURNING_KEY, '1')
    } catch {
      /* private mode — the longer timing is a harmless fallback */
    }

    const handover = () => {
      el.style.display = 'none'
      markReady()
    }

    if (reducedMotion()) {
      handover()
      return undefined
    }

    const counter = { v: 0 }
    const timeline = gsap.timeline({ onComplete: handover })

    timeline
      .to(
        counter,
        {
          v: 100,
          duration: fill,
          ease: 'power2.inOut',
          onUpdate: () => setCount(Math.round(counter.v)),
        },
        0
      )
      .fromTo(
        '.preloader-mark b',
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.7, ease: EASE.out },
        0
      )
      .fromTo(
        '.preloader-mark > span',
        { opacity: 0, x: 14 },
        { opacity: 1, x: 0, duration: 0.7, ease: EASE.out },
        0
      )
      .to('.preloader-line b', { yPercent: 0, duration: 0.9, ease: EASE.out, stagger: 0.07 }, 0.05)
      .fromTo(
        '.preloader-foot',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: EASE.soft },
        0.15
      )

    /* Word states: upcoming → active → resolved */
    const wordTimes = [0, fill / 3, (fill / 3) * 2]
    wordTimes.forEach((at, i) => timeline.call(() => setStep(i), null, at + 0.12))

    /* Handover */
    timeline
      .to('.preloader-body, .preloader-foot, .preloader-mark', {
        opacity: 0,
        y: -18,
        duration: 0.42,
        ease: 'power2.in',
      })
      .to('.preloader-track i', { scaleX: 1, duration: 0.5, ease: 'expo.inOut' }, '<0.1')
      .set('.preloader-body, .preloader-foot, .preloader-mark', { opacity: 0 })
      .to(
        '.preloader-curtain i',
        {
          yPercent: -101,
          duration: DURATION.curtain,
          ease: EASE.out,
          stagger: { each: 0.065, from: 'start' },
        },
        '-=0.18'
      )
      .to('.preloader-curtain', { autoAlpha: 0, duration: 0.2 }, '-=0.5')

    stage.reducedMotion = false
    return () => timeline.kill()
  }, [])

  return (
    <div className="preloader" ref={root} role="status" aria-live="polite">
      <span className="sr-only">Loading portfolio</span>
      <div className="preloader-grid" aria-hidden="true" />
      <div className="preloader-curtain" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="preloader-mark">
        <b>
          <i aria-hidden="true" />
          {identity.monogram}
        </b>
        <span>
          {identity.location} · {identity.relocation}
        </span>
      </div>

      <div className="preloader-body">
        {SEQUENCE.map((item, i) => (
          <p
            className="preloader-line"
            key={item.label}
            data-on={step === i ? 'true' : 'false'}
            data-past={step > i ? 'true' : 'false'}
          >
            <span>{item.idx}</span>
            <b>{item.label}</b>
          </p>
        ))}
      </div>

      <div className="preloader-foot">
        <div className="preloader-track" aria-hidden="true">
          <i />
        </div>
        <div className="preloader-meta">
          <span>Business Analyst</span>
          <b>{String(count).padStart(3, '0')}</b>
        </div>
      </div>
    </div>
  )
}
