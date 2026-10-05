import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion, EASE } from '../lib/motion'
import { identity, contact, availability } from '../data/profile'
import '../styles/contact.css'

const COPY_LABEL = 'Copy email'
const COPIED_LABEL = 'Copied'

/**
 * The close. A large statement, the email set as the primary action, and a
 * four-channel grid. Wording lines are clipped and revealed word-group by
 * word-group so the section opens the same way the hero did.
 */
export default function Contact() {
  const root = useRef(null)
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(identity.email)
    } catch {
      /* Clipboard blocked — the address is visible and selectable right beside it. */
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2200)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (reducedMotion()) return undefined
    const node = root.current
    if (!node) return undefined

    gsap.set('.contact h2 .line > span', { yPercent: 110 })
    gsap.set('.contact-note, .mail-addr, .mail-actions, .channels', { opacity: 0, y: 20 })

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: node, start: 'top 68%', once: true },
      defaults: { ease: EASE.out },
    })

    timeline
      .to('.contact h2 .line > span', { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0)
      .to('.contact-note', { opacity: 1, y: 0, duration: 0.8 }, 0.35)
      .to('.mail-addr', { opacity: 1, y: 0, duration: 0.9 }, 0.45)
      .to('.mail-actions', { opacity: 1, y: 0, duration: 0.8 }, 0.55)
      .to('.channels', { opacity: 1, y: 0, duration: 0.9 }, 0.65)

    const drift = gsap.to('.contact-glow', {
      xPercent: -12,
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true },
    })

    return () => {
      timeline.kill()
      drift.kill()
    }
  }, [])

  return (
    <section className="contact" id="contact" ref={root} aria-labelledby="contact-title">
      <span className="contact-glow" aria-hidden="true" />

      <div className="contact-inner wrap">
        <div className="contact-head">
          <p className="eyebrow">
            <span className="eyebrow-line" aria-hidden="true" /> {contact.eyebrow}
          </p>
          <p className="availability">
            <i aria-hidden="true" />
            {availability.detail}
          </p>
        </div>

        <h2 id="contact-title">
          <span className="line">
            <span>{contact.title[0]}</span>{' '}
          </span>
          <span className="line">
            <span>{contact.title[1]}</span>{' '}
          </span>
          <span className="line">
            <span>
              <em>{contact.titleAccent}</em>
            </span>{' '}
          </span>
        </h2>

        <p className="contact-note">{contact.note}</p>

        <div className="mail">
          <a className="mail-addr" href={identity.emailHref} data-cursor="mail">
            {identity.email}
          </a>
          <div className="mail-actions">
            <a
              className="button button-primary"
              href={identity.emailHref}
              data-cursor="mail"
            >
              Send an email
              <span className="button-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <a
              className="button button-secondary"
              href={identity.cv.href}
              download={identity.cv.fileName}
              data-cursor="cv"
            >
              {identity.cv.label}
              <span className="button-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </div>

        <div className="channels">
          {contact.channels.map((channel) => (
            <div key={channel.label}>
              <span>{channel.label}</span>
              {channel.href ? (
                <>
                  <a
                    href={channel.href}
                    data-cursor={channel.copy ? 'mail' : channel.external ? 'link' : 'call'}
                    {...(channel.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  >
                    {channel.value}
                    {channel.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                  {channel.copy && (
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={copy}
                      aria-live="polite"
                    >
                      {copied ? COPIED_LABEL : COPY_LABEL}
                    </button>
                  )}
                </>
              ) : (
                <b>{channel.value}</b>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
