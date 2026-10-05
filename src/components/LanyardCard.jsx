import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import { onReady } from '../lib/boot'
import { identity, profile, availability } from '../data/profile'
import CardVisual from './CardVisual'

/* Deterministic barcode-ish glyphs derived from the email — decorative only. */
function Barcode({ seed = 'rahmawjlassi' }) {
  const bars = []
  let acc = 0
  for (let i = 0; i < seed.length; i += 1) acc += seed.charCodeAt(i)
  for (let i = 0; i < 34; i += 1) {
    const w = ((acc >> (i % 12)) & 1) + ((acc >> ((i + 5) % 12)) & 1) + 1
    bars.push(<rect key={i} x={i * 5.3} y="0" width={w} height="26" />)
  }
  return (
    <svg className="badge-barcode" viewBox="0 0 180 26" preserveAspectRatio="none" aria-hidden="true">
      {bars}
    </svg>
  )
}

const DOMAINS = profile.signatureTools

/**
 * The hero's physical object: a lanyard-mounted analyst card.
 * It hangs from a simulated pendulum, can be dragged to swing with inertia,
 * and flips on click or Enter to reveal contact details on the reverse.
 */
export default function LanyardCard() {
  const rig = useRef(null)
  const badge = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const drag = useRef({ active: false, startX: 0, startAngle: 0, angle: 0, velocity: 0, lastX: 0 })

  /* Idle pendulum — a slow, small sway that reads as weight, not animation. */
  useEffect(() => {
    const node = badge.current
    if (!node) return undefined
    if (reducedMotion()) return undefined

    const idle = gsap.to(node, {
      '--swing': '7deg',
      duration: 3.1,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.6,
    })

    const stop = onReady(() => idle.play())
    return () => {
      stop()
      idle.kill()
    }
  }, [])

  /* Entrance: the card drops onto the lanyard and settles. */
  useEffect(() => onReady(() => {
    const drop = rig.current
    if (!drop || reducedMotion()) return
    gsap.fromTo(
      drop,
      { yPercent: -130 },
      { yPercent: 0, duration: 1.9, ease: 'elastic.out(1, 0.5)', delay: 0.2 }
    )
    gsap.fromTo('.badge-hint', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.2)
  }), [])

  /* Foil highlight tracks the pointer across the card face. */
  const onPointerMove = useCallback((event) => {
    const node = badge.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--gx', `${((event.clientX - rect.left) / rect.width) * 100}%`)
    node.style.setProperty('--gy', `${((event.clientY - rect.top) / rect.height) * 100}%`)
  }, [])

  const onPointerDown = (event) => {
    if (reducedMotion()) return
    const node = badge.current
    if (!node) return
    drag.current = {
      active: true,
      startX: event.clientX,
      startAngle: drag.current.angle,
      angle: drag.current.angle,
      velocity: 0,
      lastX: event.clientX,
    }
    node.setPointerCapture?.(event.pointerId)
    gsap.killTweensOf(node)
  }

  const onPointerMoveDrag = (event) => {
    const d = drag.current
    if (!d.active) return
    const dx = event.clientX - d.startX
    const angle = Math.max(-42, Math.min(42, d.startAngle + dx * 0.32))
    d.angle = angle
    d.velocity = (event.clientX - d.lastX) * 0.32
    d.lastX = event.clientX
    const node = badge.current
    if (node) node.style.setProperty('--swing', `${angle}deg`)
  }

  const release = (event) => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    badge.current?.releasePointerCapture?.(event.pointerId)
    const node = badge.current
    if (!node) return

    /* Momentum, then a damped settle back to the resting sway. */
    const settle = Math.max(-38, Math.min(38, d.angle + d.velocity * 7))
    gsap
      .timeline({ onComplete: () => {
        gsap.to(node, { '--swing': '0deg', duration: 1.4, ease: 'elastic.out(1, 0.55)' })
      } })
      .to(node, { '--swing': `${settle}deg`, duration: 0.5, ease: 'power2.out' })
      .to(node, { '--swing': '0deg', duration: 1.1, ease: 'power2.inOut' }, '>-0.05')
  }

  const toggle = () => setFlipped((v) => !v)

  return (
    <div className="badge-stage">
      <div className="badge-drop">
        <div className="badge-rig" ref={rig}>
          <div className="lanyard" aria-hidden="true">
            <span>Data · Performance</span>
          </div>
          <div className="badge-clip" aria-hidden="true">
            <i />
          </div>

          <div
            className="badge"
            ref={badge}
            data-flipped={flipped}
            data-cursor={flipped ? 'flip' : 'drag'}
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
            aria-label="Analyst card. Press Enter or Space to flip it and see contact details."
            onPointerDown={onPointerDown}
            onPointerMove={(e) => {
              onPointerMove(e)
              onPointerMoveDrag(e)
            }}
            onPointerUp={release}
            onPointerCancel={release}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggle()
              }
            }}
            onClick={(e) => {
              /* Ignore the click that ends a drag */
              if (Math.abs(drag.current.angle) > 6) {
                drag.current.angle = 0
                return
              }
              e.preventDefault()
              toggle()
            }}
          >
            <div className="badge-inner">
              {/* ---------------------------------------------------- front -- */}
              <div className="badge-face">
                <span className="badge-slot" aria-hidden="true" />

                <div className="badge-top">
                  <span className="badge-logo">BA</span>
                  <span className="badge-org">Insight · Analytics</span>
                  <span className="badge-chip" aria-hidden="true" />
                </div>

                <CardVisual />

                <div className="badge-who">
                  <span className="badge-name">{identity.fullName}</span>
                  <span className="badge-role">{identity.title}</span>
                  <span className="badge-team">{identity.discipline}</span>
                </div>

                <dl className="badge-fields">
                  <div>
                    <dt>Base</dt>
                    <dd>Sousse</dd>
                  </div>
                  <div>
                    <dt>Stack</dt>
                    <dd>BI · DAX</dd>
                  </div>
                  <div>
                    <dt>Since</dt>
                    <dd>2022</dd>
                  </div>
                </dl>

                <footer className="badge-foot">
                  <Barcode seed={identity.email} />
                  <span className="badge-code">RJ · 216</span>
                </footer>

                <span className="badge-foil" aria-hidden="true" />
              </div>

              {/* ----------------------------------------------------- back -- */}
              <div className="badge-face badge-back" aria-hidden={!flipped}>
                <span className="badge-slot" aria-hidden="true" />

                <div className="badge-back-head">
                  <span className="badge-logo">RJ</span>
                  <span>Contact card</span>
                </div>

                <ul className="badge-contact">
                  <li>
                    <span>Email</span>
                    <b>{identity.email}</b>
                  </li>
                  <li>
                    <span>Phone</span>
                    <b>{identity.phone}</b>
                  </li>
                  <li>
                    <span>LinkedIn</span>
                    <b>{identity.linkedin}</b>
                  </li>
                  <li>
                    <span>Availability</span>
                    <b>{availability.detail}</b>
                  </li>
                </ul>

                <div className="badge-domains">
                  <span className="badge-label">Core toolkit</span>
                  <div>
                    {DOMAINS.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>

                <footer className="badge-back-foot">
                  <span className="brand-avatar" aria-hidden="true">
                    <span>{identity.monogram}</span>
                  </span>
                  <div>
                    <b>{identity.fullName}</b>
                    <span>
                      {identity.location} · {identity.relocation}
                    </span>
                  </div>
                </footer>

                <span className="badge-foil" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <p className="badge-hint" aria-hidden="true">
          {flipped ? 'Click to flip back' : 'Click to flip · drag to swing'}
        </p>
      </div>
    </div>
  )
}
