import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import { education, languages } from '../data/profile'
import SectionHead from './SectionHead'
import '../styles/education.css'

/**
 * Education, deliberately quieter than the career section: a plain list on the
 * left, languages as a discrete self-assessed scale on the right. The scale is
 * a labelled proficiency word plus filled segments — never a percentage.
 */
export default function Education() {
  const root = useRef(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    if (reducedMotion()) {
      setDrawn(true)
      return undefined
    }

    const node = root.current
    if (!node) return undefined

    /* Scoped to this component: bare '.degree'/'.lang' selectors are global and
       would also catch same-named nodes elsewhere. */
    const degrees = gsap.utils.toArray('.degree', node)
    const langs = gsap.utils.toArray('.lang', node)
    const langWrap = node.querySelector('.langs')

    gsap.set(degrees, { opacity: 0, y: 24 })
    gsap.set(langs, { opacity: 0, y: 16 })
    gsap.set(langWrap, { opacity: 0, y: 24 })

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: node, start: 'top 78%', once: true },
      defaults: { ease: 'power3.out' },
      onComplete: () => setDrawn(true),
    })

    timeline
      .to(degrees, { opacity: 1, y: 0, duration: 0.85, stagger: 0.1 }, 0)
      .to(langWrap, { opacity: 1, y: 0, duration: 0.8 }, 0.15)
      .to(langs, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.3)

    return () => timeline.kill()
  }, [])

  return (
    <section className="block" id="education" ref={root} aria-labelledby="education-title">
      <div className="wrap">
        <SectionHead
          eyebrow="Education"
          title="Business, then hospitality — in that order."
          sub="A business administration foundation, an entrepreneurship master's, and a hospitality management master's that put revenue management in front of her."
          id="education-title"
        />

        <div className="edu">
          <ol className="degrees">
            {education.map((item) => (
              <li className="degree" key={item.field}>
                <span className="yr">{item.years}</span>
                <div className="degree-body">
                  <h3>{item.field}</h3>
                  <p>{item.degree}</p>
                  <span className="school">
                    <i aria-hidden="true" />
                    {item.school}
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <div className="langs">
            <div className="langs-title">
              <span>Languages</span>
              <b>3</b>
            </div>

            {languages.map((lang) => (
              <div className="lang" key={lang.label}>
                {lang.label}
                <span>{lang.level}</span>
                <div
                  className="bar"
                  role="img"
                  aria-label={`${lang.label}: ${lang.level}`}
                >
                  {Array.from({ length: lang.of }, (_, i) => (
                    <i
                      key={i}
                      style={{ '--i': i }}
                      data-on={drawn && i < lang.filled ? 'true' : 'false'}
                    />
                  ))}
                </div>
              </div>
            ))}

            <p className="langs-foot">
              Arabic is the working language of the role; French and English carry the reporting
              and the international coursework.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
