import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion, EASE } from '../lib/motion'
import { onReady } from '../lib/boot'
import { identity, hero } from '../data/profile'
import { scrollToId } from '../lib/scrollTo'
import LanyardCard from './LanyardCard'
import '../styles/hero.css'

export default function Hero() {
  const root = useRef(null)

  /* Pointer-tracked glow offset, normalised to -0.5 … 0.5 */
  useEffect(() => {
    const node = root.current
    if (!node || reducedMotion()) return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined

    const onMove = (event) => {
      const rect = node.getBoundingClientRect()
      node.style.setProperty('--mouse-x', (event.clientX - rect.left) / rect.width - 0.5)
      node.style.setProperty('--mouse-y', (event.clientY - rect.top) / rect.height - 0.5)
    }
    const onLeave = () => {
      node.style.setProperty('--mouse-x', 0)
      node.style.setProperty('--mouse-y', 0)
    }

    node.addEventListener('pointermove', onMove, { passive: true })
    node.addEventListener('pointerleave', onLeave)
    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  /* Entrance — clipped word reveals, then everything else settling in behind. */
  useEffect(() => onReady(() => {
    if (reducedMotion()) {
      gsap.set('.hero-eyebrow, .hero-role, .hero-lede, .hero-actions, .hero-meta, .hero-bottom, .orbit-tick', {
        opacity: 1,
      })
      return
    }

    const timeline = gsap.timeline({ defaults: { ease: EASE.out } })

    timeline
      .fromTo(
        '.hero-eyebrow',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.1
      )
      .fromTo(
        '.hero-title .word',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.3, stagger: 0.1 },
        0.15
      )
      .fromTo(
        ['.hero-role', '.hero-lede', '.hero-actions', '.hero-meta'],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
        0.5
      )
      .fromTo('.hero-bottom', { opacity: 0 }, { opacity: 1, duration: 1 }, 0.9)
      .fromTo(
        '.hero-orbit',
        { opacity: 0, rotateZ: -18 },
        { opacity: 1, rotateZ: 0, duration: 1.6, ease: 'expo.out' },
        0.4
      )
      .fromTo(
        '.orbit-tick',
        { opacity: 0, scale: 0.2 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' },
        0.8
      )
  }), [])

  /* Departure — the copy recedes, the card rotates away. */
  useEffect(() => {
    if (reducedMotion()) return undefined

    const tween = gsap.to('.hero-copy', {
      y: -80,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    })

    const card = gsap.to('.hero-visual', {
      yPercent: -10,
      rotateY: -16,
      rotateX: 6,
      transformPerspective: 1200,
      scale: 0.86,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true },
    })

    return () => {
      tween.kill()
      card.kill()
    }
  }, [])

  return (
    <section className="hero" ref={root} id="top" aria-labelledby="hero-title">
      <div className="hero-background" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
      </div>

      <div className="hero-inner wrap">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" aria-hidden="true" />
            <span>{hero.eyebrow}</span>
          </div>

          <h1 className="hero-title" id="hero-title">
            <span className="line">
              <span className="word">{identity.firstName}</span>{' '}
            </span>
            <span className="line">
              <span className="word accent">{identity.lastName}</span>{' '}
            </span>
          </h1>

          <div className="hero-role">
            {hero.role.map((item, i) => (
              <span key={item}>
                {i > 0 && <i aria-hidden="true">·</i>}
                {item}
              </span>
            ))}
          </div>

          <p className="hero-lede">{hero.lede}</p>

          <div className="hero-actions">
            <a
              href="#journey"
              className="button button-primary"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('journey')
              }}
            >
              <span>{hero.primary}</span>
              <span className="button-arrow" aria-hidden="true">
                ↘
              </span>
            </a>
            <a
              href={identity.cv.href}
              download={identity.cv.fileName}
              className="button button-secondary"
              data-cursor="cv"
            >
              {hero.secondary}
              <span className="button-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>

          <dl className="hero-meta">
            {hero.meta.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-visual">
          <div className="hero-orbit" aria-hidden="true">
            <span className="orbit-tick" />
          </div>
          <LanyardCard />
        </div>
      </div>

      <div className="hero-bottom">
        <a
          href="#profile"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('profile')
          }}
        >
          Scroll to explore
          <span className="scroll-indicator" aria-hidden="true">
            <span />
          </span>
        </a>
        <span>Data · Analysis · Decision making</span>
      </div>
    </section>
  )
}
