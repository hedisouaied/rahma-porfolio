import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import { skillChains, skillIndex } from '../data/profile'
import { useMedia } from '../hooks/useObservers'
import SectionHead from './SectionHead'
import '../styles/skills.css'

/**
 * Skills as relationships rather than percentages. Each chain is a sequence:
 * the tool on the left produces the capability on the right. One chain is open
 * at a time so the section reads as a narrative, and every chain is reachable
 * by keyboard and tap.
 */
export default function Skills() {
  const [active, setActive] = useState(skillChains[0].id)
  const root = useRef(null)
  const fine = useMedia('(hover: hover) and (pointer: fine)')

  useEffect(() => {
    if (reducedMotion()) return undefined
    const tween = gsap.from('.chain', {
      opacity: 0,
      y: 26,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
    })
    return () => tween.kill()
  }, [])

  return (
    <section className="block" id="skills" ref={root} aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHead
          eyebrow="Skills"
          title="Tools, and what they turn into."
          sub="These are the working relationships behind the work — each tool in service of a capability, each capability in service of a decision. No invented percentages."
          id="skills-title"
        />

        <div className="chains">
          {skillChains.map((chain, ci) => {
            const on = active === chain.id
            return (
              <div
                className="chain"
                key={chain.id}
                data-on={on}
                onPointerEnter={fine ? () => setActive(chain.id) : undefined}
              >
                <button
                  type="button"
                  className="chain-head"
                  aria-expanded={on}
                  aria-controls={`chain-${chain.id}`}
                  onClick={() => setActive(on ? null : chain.id)}
                >
                  <b>{String(ci + 1).padStart(2, '0')}</b>
                  {chain.kicker}
                  <i />
                  <em>{on ? 'Showing' : 'Show chain'}</em>
                </button>

                <div className="chain-body" id={`chain-${chain.id}`}>
                  <div>
                    <ol className="chain-flow">
                      {chain.nodes.map((node, i) => (
                        <li key={node} style={{ display: 'contents' }}>
                          <span
                            className={`node${i === chain.nodes.length - 1 ? ' is-outcome' : ''}`}
                            style={{ '--i': i }}
                          >
                            <span>{String(i + 1).padStart(2, '0')}</span>
                            <b>{node}</b>
                          </span>
                          {i < chain.nodes.length - 1 && (
                            <span className="connector" style={{ '--i': i }} aria-hidden="true">
                              <i />
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <dl className="skill-index">
          {skillIndex.map((row) => (
            <div className="skill-row" key={row.group}>
              <dt>{row.group}</dt>
              <dd>
                {row.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <p className="skills-note">
          <b>Built on top of these:</b> Power BI · DAX · Python · Data modelling · Advanced Excel ·
          Data visualisation &amp; reporting · Revenue management · OTA and channel management ·
          Competitive benchmarking · Demand forecasting · Business analysis.
        </p>
      </div>
    </section>
  )
}
