import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import { profile, decorative } from '../data/profile'
import SectionHead from './SectionHead'
import '../styles/profile.css'

const W = 420
const H = 150
const PAD = 18

const toLine = (values, max) => {
  const step = (W - PAD * 2) / (values.length - 1)
  return values
    .map((v, i) => {
      const x = PAD + i * step
      const y = H - 30 - (v / max) * (H - 56)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

const line = toLine(decorative.sparkline, 100)
const alt = toLine(
  decorative.sparkline.map((v, i) => Math.max(8, v - 26 - (i % 3) * 5)),
  100
)

/**
 * The profile block. Left column states the positioning; right column is a
 * console window that draws its chart on entry and lays out her method as a
 * question and a numbered answer. The chart is decorative and labelled as such.
 */
export default function Profile() {
  const head = useRef(null)
  const spark = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return undefined

    const node = spark.current
    const length = node?.getTotalLength?.() ?? 700
    if (node) gsap.set(node, { strokeDasharray: length, strokeDashoffset: length })

    const timeline = gsap.timeline({ scrollTrigger: { trigger: '.console', start: 'top 80%', once: true } })

    if (node) {
      timeline.to(node, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 0)
    }

    timeline
      .fromTo(
        '.spark-dot',
        { scale: 0, transformOrigin: '50% 50%' },
        { scale: 1, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.14 },
        0.7
      )
      .fromTo(
        '.chat .q, .chat .a',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.14 },
        0.5
      )

    return () => timeline.kill()
  }, [])

  return (
    <section className="block" id="profile" aria-labelledby="profile-title">
      <div className="wrap">
        <SectionHead
          ref={head}
          eyebrow={profile.eyebrow}
          title={profile.title}
          sub={profile.body}
          id="profile-title"
        />

        <div className="case">
          <div className="case-col">
            <p className="case-lede reveal">{profile.lede}</p>

            <dl className="pao">
              {profile.terms.map(([term, meaning]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>

            <div className="readout reveal">
              {profile.readouts.map(([value, label]) => (
                <div key={label}>
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <ul className="tags reveal">
              {profile.signatureTools.map((tool) => (
                <li className="tag" key={tool}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <div className="case-col">
            <div className="console">
              <div className="console-bar">
                <span className="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span>method · question to report</span>
              </div>

              <div className="console-body">
                <div>
                  <p className="spark-label">
                    <span>single source of truth</span>
                    <b>1</b>
                  </p>

                  <svg
                    className="spark"
                    viewBox={`0 0 ${W} ${H}`}
                    role="img"
                    aria-label="Decorative trend illustration. Not a performance figure."
                  >
                    <g className="spark-grid" aria-hidden="true">
                      {[0, 1, 2, 3].map((i) => (
                        <line key={i} x1="0" y1={22 + i * 32} x2={W} y2={22 + i * 32} />
                      ))}
                    </g>

                    <path className="spark-area" d={`${line} L${W - PAD} ${H - 26} L${PAD} ${H - 26} Z`} opacity="0" />
                    <path className="spark-line is-alt" d={alt} />
                    <path className="spark-line" d={line} ref={spark} />

                    <g aria-hidden="true">
                      {decorative.sparkline
                        .map((v, i) => {
                          const step = (W - PAD * 2) / (decorative.sparkline.length - 1)
                          return {
                            x: PAD + i * step,
                            y: H - 30 - (v / 100) * (H - 56),
                          }
                        })
                        .filter((_, i) => i % 5 === 4)
                        .map((p, i) => (
                          <circle key={i} className="spark-dot" cx={p.x} cy={p.y} r="3" opacity="0" />
                        ))}
                    </g>

                    <g aria-hidden="true">
                      {decorative.axis.map((label, i) => (
                        <text key={label} className="spark-tag" x={PAD + i * 118} y={H - 8}>
                          {label}
                        </text>
                      ))}
                    </g>
                  </svg>

                  <p className="spark-caption">
                    <i aria-hidden="true" />
                    {decorative.note}
                  </p>
                </div>

                <div className="chat">
                  <p className="q">
                    <small>Business</small>
                    {profile.method}?
                  </p>
                  <div className="a">
                    <small>Rahma</small>
                    <ol>
                      {profile.methodSteps.map(([, text]) => (
                        <li key={text}>{text}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
