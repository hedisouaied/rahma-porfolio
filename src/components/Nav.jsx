import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, reducedMotion, EASE } from '../lib/motion'
import { onReady } from '../lib/boot'
import { lockScroll, unlockScroll } from '../lib/scrollLock'
import { useTheme } from '../hooks/useTheme'
import { useActiveSection, useScrolled, useScrollDirection } from '../hooks/useObservers'
import { identity, nav, availability } from '../data/profile'
import { scrollToId } from '../lib/scrollTo'

const NAV_IDS = nav.map((item) => item.id)

function SunIcon() {
  return (
    <svg className="i-sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.4 5.4l1.9 1.9M16.7 16.7l1.9 1.9M18.6 5.4l-1.9 1.9M7.3 16.7l-1.9 1.9" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="i-moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.4 14.2A8.6 8.6 0 0 1 9.8 3.6a8.8 8.8 0 1 0 10.6 10.6Z" />
    </svg>
  )
}

export function Brand({ onClick }) {
  return (
    <a className="brand" href="#top" onClick={onClick} aria-label={`${identity.fullName} — home`}>
      <span className="brand-avatar" aria-hidden="true">
        <span>{identity.monogram}</span>
      </span>
      <span className="brand-text">
        <strong>{identity.firstName}</strong>
        <span>{identity.lastName}</span>
      </span>
    </a>
  )
}

export default function Nav() {
  const { theme, toggle } = useTheme()
  const active = useActiveSection(NAV_IDS)
  const scrolled = useScrolled(40)
  const hidden = useScrollDirection()
  const [open, setOpen] = useState(false)
  const shell = useRef(null)
  const indicator = useRef(null)
  const progress = useRef(null)
  const menuButton = useRef(null)

  const go = (event, id) => {
    event.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  /* Sliding pill behind the active link */
  useEffect(() => {
    const node = shell.current
    const pill = indicator.current
    if (!node || !pill) return

    const link = node.querySelector(`.nav-links a[href="#${active}"]`)
    if (!link) {
      gsap.to(pill, { opacity: 0, duration: 0.25 })
      return
    }
    gsap.to(pill, {
      x: link.offsetLeft,
      width: link.offsetWidth,
      opacity: 1,
      duration: 0.45,
      ease: EASE.out,
    })
  }, [active])

  /* Hairline read-progress along the shell's underside */
  useEffect(() => {
    const bar = progress.current
    if (!bar) return
    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: reducedMotion() ? true : 0.25 },
    })
    return () => tween.kill()
  }, [])

  /* Intro: the shell settles in from above */
  useEffect(() => onReady(() => {
    if (reducedMotion()) return
    gsap.fromTo(
      '.nav-shell',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: EASE.out }
    )
  }), [])

  /* Body scroll lock while the sheet is open */
  useEffect(() => {
    if (open) {
      lockScroll()
      return unlockScroll
    }
    return undefined
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className="nav" data-scrolled={scrolled} data-hidden={hidden && !open}>
        <div className="nav-shell" ref={shell}>
          <Brand onClick={(e) => go(e, 'top')} />

          <nav className="nav-links" aria-label="Sections">
            <span className="nav-indicator" ref={indicator} aria-hidden="true" />
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                onClick={(e) => go(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <p className="availability">
              <i aria-hidden="true" />
              {availability.status}
            </p>

            <button
              type="button"
              className="icon-btn theme-toggle"
              onClick={(e) => toggle(e.currentTarget)}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <SunIcon />
              <MoonIcon />
            </button>

            <a
              className="nav-cta"
              href={identity.cv.href}
              download={identity.cv.fileName}
              data-cursor="CV"
            >
              {identity.cv.label}
              <span aria-hidden="true">↓</span>
            </a>

            <button
              ref={menuButton}
              type="button"
              className="menu-button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>

          <div className="nav-progress" aria-hidden="true">
            <i ref={progress} />
          </div>
        </div>
      </header>

      <div className="mobile-menu" id="mobile-menu" data-open={open} aria-hidden={!open}>
        <nav className="mobile-links" aria-label="Sections">
          {nav.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{ '--i': i }}
              aria-current={active === item.id ? 'true' : undefined}
              tabIndex={open ? 0 : -1}
              onClick={(e) => go(e, item.id)}
            >
              <span className="mobile-idx" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mobile-foot">
          <div className="mobile-actions">
            <a
              className="button button-primary"
              href={identity.cv.href}
              download={identity.cv.fileName}
              tabIndex={open ? 0 : -1}
            >
              {identity.cv.label}
              <span className="button-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
            <button
              type="button"
              className="button button-secondary"
              tabIndex={open ? 0 : -1}
              onClick={(e) => toggle(e.currentTarget)}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>

          <div className="mobile-contact">
            <span className="brand-avatar" aria-hidden="true">
              <span>{identity.monogram}</span>
            </span>
            <div>
              <strong>{identity.email}</strong>
              <span>
                {identity.location} · {identity.relocation}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { SunIcon, MoonIcon }
