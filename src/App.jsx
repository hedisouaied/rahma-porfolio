import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion, createSmoothScroll, EASE } from './lib/motion'
import { registerLenis } from './lib/scrollLock'
import { onReady } from './lib/boot'

import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import Story from './components/Story'
import Thesis from './components/Thesis'
import Marquee from './components/Marquee'
import Profile from './components/Profile'
import Experience from './components/Experience'
import Award from './components/Award'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'

import { toolset } from './data/profile'

import './styles/tokens.css'
import './styles/base.css'
import './styles/ui.css'
import './styles/chrome.css'

const MARQUEE = [
  ...toolset,
  'Single source of truth',
  'Executive reporting',
  'Decision making',
]

/**
 * Section-level scroll choreography. Anything tagged `.reveal` fades up once as
 * it enters; nothing here runs before the preloader hands over.
 */
function useReveals() {
  useEffect(() => {
    const off = onReady(() => {
      if (reducedMotion()) {
        gsap.set('.reveal', { clearProps: 'all' })
        return
      }

      gsap.utils.toArray('.reveal').forEach((node) => {
        gsap.from(node, {
          y: 35,
          opacity: 0.15,
          duration: 1,
          ease: EASE.soft,
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        })
      })

      /* Horizontal rules wipe open as their block arrives. */
      gsap.utils.toArray('.pao > div, .skill-row, .degree').forEach((node) => {
        gsap.from(node, {
          opacity: 0,
          x: -18,
          duration: 0.85,
          ease: EASE.soft,
          scrollTrigger: { trigger: node, start: 'top 90%', once: true },
        })
      })
    })

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      off()
      cancelAnimationFrame(raf)
    }
  }, [])
}

export default function App() {
  const root = useRef(null)

  useEffect(() => {
    const scroller = createSmoothScroll()
    registerLenis(scroller.lenis)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      scroller.destroy()
    }
  }, [])

  useReveals()

  return (
    <div ref={root}>
      <Preloader />
      <Cursor />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="vignette" aria-hidden="true" />
      <Nav />

      <main id="main">
        <Hero />
        <Story />
        <Thesis />
        <Marquee items={MARQUEE} />
        <Profile />
        <Experience />
        <Award />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
