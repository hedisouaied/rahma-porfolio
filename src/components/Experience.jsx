import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import { experience, careerMarkers } from '../data/profile'
import { useMedia } from '../hooks/useObservers'
import SectionHead from './SectionHead'
import { scrollToId } from '../lib/scrollTo'
import '../styles/experience.css'

/**
 * The career journey. Each role is a button that reveals its responsibilities;
 * the summary line stays visible at all times, so nothing is hidden behind an
 * interaction. Pointer devices open on hover, touch devices open on tap.
 */
export default function Experience() {
  const [open, setOpen] = useState(() => (typeof window === 'undefined' ? null : experience[0].id))
  const fine = useMedia('(hover: hover) and (pointer: fine)')
  const head = useRef(null)

  /* On pointer devices, hovering a row takes over; on touch, tapping does. */
  const activate = (id) => {
    if (fine) setOpen(id)
  }

  useEffect(() => {
    setOpen(experience[0].id)
  }, [])

  useEffect(() => {
    if (reducedMotion()) return undefined
    const tween = gsap.from('.journey-spine li', {
      opacity: 0,
      x: -14,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: { trigger: '.journey', start: 'top 78%', once: true },
    })
    return () => tween.kill()
  }, [])

  return (
    <section className="block" id="journey" aria-labelledby="journey-title">
      <div className="wrap">
        <SectionHead
          ref={head}
          eyebrow="Experience"
          title="From hospitality to data."
          sub="Four roles, one direction: getting closer to the number that drives the decision. Hover or tap a role to read what it involved."
          id="journey-title"
        />

        <div className="journey">
          <ol className="journey-spine">
            {careerMarkers.map((marker) => (
              <li
                key={`${marker.year}-${marker.label}`}
                className={marker.highlight ? 'is-award' : undefined}
                data-on={experience.some(
                  (job) => job.id === open && job.when === marker.year
                )}
              >
                <span>
                  <b>{marker.year}</b>
                  <em>{marker.label}</em>
                </span>
              </li>
            ))}
          </ol>

          <ol className="jobs">
            {experience.map((job) => {
              const isOpen = open === job.id
              return (
                <li
                  className="job"
                  key={job.id}
                  data-open={isOpen}
                  onPointerEnter={fine ? () => activate(job.id) : undefined}
                >
                  <h3 className="sr-only">
                    {job.role} — {job.org}, {job.when}
                  </h3>

                  <button
                    type="button"
                    className="job-head"
                    aria-expanded={isOpen}
                    aria-controls={`${job.id}-panel`}
                    onClick={() => setOpen(isOpen ? null : job.id)}
                  >
                    <span className="job-when">
                      <b>{job.when.split(' ')[0]}</b>
                      <span>{job.when.split(' ').slice(1).join(' ') || '—'}</span>
                    </span>

                    <span className="job-title">
                      <span className="job-role">{job.role}</span>
                      <span className="job-org">
                        {job.org}
                        <span className="job-type">{job.type}</span>
                      </span>
                      <span className="job-summary">{job.summary}</span>
                    </span>

                    <span className="job-toggle" aria-hidden="true">
                      {isOpen ? 'Close' : 'Details'}
                      <i />
                    </span>
                  </button>

                  <div className="job-panel" id={`${job.id}-panel`}>
                    <div>
                      <ul className="job-points">
                        {job.points.map((point, i) => (
                          <li key={point} style={{ '--i': i }}>
                            {point}
                          </li>
                        ))}
                      </ul>

                      {job.milestone && (
                        <div className="job-milestone">
                          <b>{job.milestone.year}</b>
                          <span>{job.milestone.label}</span>
                          <a
                            className="rule-link"
                            href="#award"
                            onClick={(e) => {
                              e.preventDefault()
                              scrollToId('award')
                            }}
                          >
                            See the moment ↘
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
