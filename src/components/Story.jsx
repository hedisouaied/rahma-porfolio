import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, reducedMotion, smoothstep, clamp01, stage as shared } from '../lib/motion'
import { pipeline } from '../data/profile'
import '../styles/story.css'

const W = 400
const H = 320
const N = pipeline.length

/* Deterministic PRNG so the geometry is identical on every mount. */
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const READOUT = [
  { read: 'source', value: 'raw · multi' },
  { read: 'integrity', value: 'validated' },
  { read: 'model', value: 'star · dax' },
  { read: 'signal', value: 'variance' },
  { read: 'surface', value: 'report' },
  { read: 'action', value: 'aligned' },
]

const ANNOTATIONS = [
  [
    { x: 22, y: 30, t: 'source' },
    { x: 70, y: 22, t: 'extract' },
    { x: 48, y: 72, t: 'request' },
  ],
  [
    { x: 26, y: 28, t: 'nulls removed' },
    { x: 66, y: 64, t: 'types aligned' },
  ],
  [
    { x: 50, y: 54, t: 'fact' },
    { x: 17, y: 18, t: 'time dim' },
    { x: 82, y: 20, t: 'channel dim' },
  ],
  [
    { x: 30, y: 28, t: 'series A' },
    { x: 70, y: 46, t: 'threshold' },
  ],
  [
    { x: 28, y: 68, t: 'segment' },
    { x: 74, y: 30, t: 'trend' },
  ],
  [{ x: 50, y: 48, t: 'one decision' }],
]

function sparkPath(values, max, padX, padY) {
  const step = (W - padX * 2) / (values.length - 1)
  return values
    .map((v, i) => {
      const x = padX + i * step
      const y = H - padY - (v / max) * (H - padY * 2)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

function buildGeometry() {
  const rnd = seeded(20250725)

  const scatter = Array.from({ length: 34 }, () => ({
    x: 26 + rnd() * (W - 52),
    y: 26 + rnd() * (H - 52),
    r: 1.2 + rnd() * 2.1,
    o: 0.25 + rnd() * 0.5,
  }))

  const cols = 7
  const rows = 5
  const lattice = Array.from({ length: cols * rows }, (_, i) => {
    const c = i % cols
    const r = Math.floor(i / cols)
    return {
      x: 40 + c * ((W - 80) / (cols - 1)),
      y: 34 + r * ((H - 68) / (rows - 1)),
      r: 2.4,
      outlier: i === 9 || i === 24,
    }
  })

  const fact = { x: W / 2, y: H / 2 + 6, r: 15 }
  const dims = [
    { x: W * 0.19, y: H * 0.2, r: 9, label: 'date' },
    { x: W * 0.81, y: H * 0.22, r: 9, label: 'channel' },
    { x: W * 0.2, y: H * 0.82, r: 9, label: 'segment' },
    { x: W * 0.8, y: H * 0.8, r: 9, label: 'metric' },
  ]

  const series = [
    { d: sparkPath([30, 44, 38, 52, 47, 61, 55, 70, 64, 78], 100, 34, 46), live: false },
    { d: sparkPath([46, 42, 50, 47, 58, 63, 59, 72, 76, 88], 100, 34, 46), live: true },
    { d: sparkPath([24, 30, 27, 36, 33, 40, 37, 45, 42, 50], 100, 34, 46), live: false },
  ]
  const thresholdY = H - 46 - 0.6 * (H - 92)

  const heights = [0.34, 0.52, 0.41, 0.66, 0.58, 0.74, 0.63, 0.81, 0.7, 0.88, 0.79, 0.95]
  const barW = 18
  const barGap = (W - 76 - heights.length * barW) / (heights.length - 1)
  const rects = heights.map((v, i) => ({
    x: 38 + i * (barW + barGap),
    h: v * (H - 128),
    y: H - 62 - v * (H - 128),
    live: i >= heights.length - 3,
  }))

  const reportSpark = sparkPath([22, 30, 27, 40, 36, 52, 48, 62, 58, 74, 70, 86], 100, 38, 116)

  const converge = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8
    return {
      d: `M${(20 + t * (W - 40)).toFixed(1)} ${i % 2 === 0 ? 12 : H - 12} L${W / 2} ${H / 2}`,
      o: 0.2 + (1 - Math.abs(t - 0.5) * 2) * 0.6,
    }
  })

  return { scatter, lattice, fact, dims, series, thresholdY, rects, reportSpark, converge }
}

/**
 * The analytical field. Six geometric states share one SVG; scroll progress
 * cross-fades them using only opacity and transform. Layer motion is written
 * imperatively from the GSAP ticker so scrolling never triggers a React
 * render.
 */
function DataField({ index }) {
  const root = useRef(null)
  const layerRefs = useRef([])
  const geo = useRef(buildGeometry())

  useEffect(() => {
    const nodes = layerRefs.current.filter(Boolean)

    if (reducedMotion()) {
      nodes.forEach((node, i) => gsap.set(node, { opacity: i === index ? 1 : 0, y: 0, scale: 1 }))
      return undefined
    }

    const tick = () => {
      const value = shared.pipeline
      nodes.forEach((node, i) => {
        const distance = Math.abs(i - value)
        const opacity = clamp01(1 - distance * 1.05)
        const shift = (i - value) * 30
        node.style.opacity = opacity.toFixed(3)
        node.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(${(
          1 - Math.min(0.07, distance * 0.035)
        ).toFixed(3)})`
      })
    }

    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [index])

  /* Each state breathes on its own clock, so nothing on screen is ever static. */
  useEffect(() => {
    if (reducedMotion()) return undefined
    const node = root.current
    if (!node) return undefined

    const q = (sel) => gsap.utils.toArray(sel, node)
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.35 })

    tl.fromTo(
      q('.fg-scatter .fg-dot'),
      { opacity: 0.14, scale: 0.6 },
      {
        opacity: 0.95,
        scale: 1,
        duration: 0.85,
        ease: 'sine.inOut',
        stagger: { each: 0.028, from: 'random' },
        yoyo: true,
        repeat: 1,
        transformOrigin: '50% 50%',
      },
      0
    )
      .fromTo(
        q('.fg-schema .fg-ring'),
        { scale: 0.82, opacity: 0.25 },
        { scale: 1.1, opacity: 0.9, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: 1 },
        0
      )
      .fromTo(
        q('.fg-series .fg-line.is-live'),
        { strokeDashoffset: 260 },
        { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' },
        0
      )
      .fromTo(
        q('.fg-bars .fg-bar'),
        { scaleY: 0.05 },
        { scaleY: 1, duration: 1.05, ease: 'power3.out', stagger: 0.04 },
        0
      )
      .fromTo(
        q('.fg-report-spark'),
        { strokeDashoffset: 320 },
        { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' },
        0.2
      )
      .fromTo(
        q('.fg-decision-halo'),
        { scale: 0.55, opacity: 0.12 },
        { scale: 1.85, opacity: 0.7, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: 1 },
        0
      )
      .fromTo(
        q('.fg-scanline'),
        { attr: { x: -40 } },
        { attr: { x: W + 40 }, duration: 2.6, ease: 'power1.inOut' },
        0
      )

    return () => tl.kill()
  }, [])

  const g = geo.current
  const layer = (i) => (node) => {
    layerRefs.current[i] = node
  }

  return (
    <div
      className="story-field"
      ref={root}
      style={{ '--stage-c': `var(--stage-${index + 1})` }}
    >
      <div className="field-frame" aria-hidden="true" />
      <span className="field-corner tl" aria-hidden="true" />
      <span className="field-corner tr" aria-hidden="true" />
      <span className="field-corner bl" aria-hidden="true" />
      <span className="field-corner br" aria-hidden="true" />

      <div className="field-meta" aria-hidden="true">
        <span>pipeline / {String(index + 1).padStart(2, '0')}</span>
        <b>{pipeline[index].label}</b>
      </div>
      <div className="field-readout" aria-hidden="true">
        <span>{READOUT[index].read}</span>
        <b>{READOUT[index].value}</b>
      </div>
      <div className="field-legend" aria-hidden="true">
        <i />
        {index === 2 ? 'model' : index === 5 ? 'decision' : 'signal'}
      </div>

      <div className="field-canvas">
      <svg
        className="field-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Abstract diagram of the ${pipeline[index].label} stage: ${pipeline[index].title}`}
      >
        <g className="fg-grid" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <line key={`gx${i}`} x1={(W / 6) * i} y1="0" x2={(W / 6) * i} y2={H} vectorEffect="non-scaling-stroke" />
          ))}
          {[1, 2, 3, 4, 5].map((i) => (
            <line key={`gy${i}`} x1="0" y1={(H / 6) * i} x2={W} y2={(H / 6) * i} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        <g className="field-layer fg-scatter" ref={layer(0)} aria-hidden="true">
          {g.scatter.map((p, i) => (
            <circle key={i} className="fg-dot" cx={p.x} cy={p.y} r={p.r} opacity={p.o} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        <g className="field-layer fg-lattice" ref={layer(1)} aria-hidden="true">
          {g.lattice.map((p, i) =>
            p.outlier ? (
              <g key={i}>
                <rect
                  className="fg-outlier"
                  x={p.x - 7}
                  y={p.y - 7}
                  width="14"
                  height="14"
                  rx="2"
                  transform={`rotate(45 ${p.x} ${p.y})`}
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  className="fg-outlier"
                  x1={p.x - 4.5}
                  y1={p.y - 4.5}
                  x2={p.x + 4.5}
                  y2={p.y + 4.5}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ) : (
              <circle key={i} className="fg-dot is-live" cx={p.x} cy={p.y} r={p.r} vectorEffect="non-scaling-stroke" />
            )
          )}
        </g>

        <g className="field-layer fg-schema" ref={layer(2)} aria-hidden="true">
          {g.dims.map((d, i) => (
            <line
              key={`l${i}`}
              className="fg-link is-live"
              x1={g.fact.x}
              y1={g.fact.y}
              x2={d.x}
              y2={d.y}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {g.dims.map((d) => (
            <g key={d.label}>
              <rect
                className="fg-ring"
                x={d.x - d.r}
                y={d.y - d.r}
                width={d.r * 2}
                height={d.r * 2}
                rx="4"
                style={{ transformOrigin: `${d.x}px ${d.y}px` }}
                vectorEffect="non-scaling-stroke"
              />
              <text className="fg-tag" x={d.x - 13} y={d.y + d.r + 11}>
                {d.label}
              </text>
            </g>
          ))}
          <circle className="fg-dot is-live" cx={g.fact.x} cy={g.fact.y} r={g.fact.r} vectorEffect="non-scaling-stroke" />
          <circle className="fg-ring" cx={g.fact.x} cy={g.fact.y} r={g.fact.r + 9} vectorEffect="non-scaling-stroke" />
          <text className="fg-tag" x={g.fact.x - 15} y={g.fact.y + g.fact.r + 21}>
            fact
          </text>
        </g>

        <g className="field-layer fg-series" ref={layer(3)} aria-hidden="true">
          <line
            className="fg-axis"
            x1="28"
            y1={g.thresholdY}
            x2={W - 18}
            y2={g.thresholdY}
            strokeDasharray="4 5"
            vectorEffect="non-scaling-stroke"
          />
          {g.series.map((s, i) => (
            <path
              key={i}
              className={`fg-line${s.live ? ' is-live' : ''}`}
              d={s.d}
              stroke={s.live ? 'var(--stage-ink)' : 'var(--line-strong)'}
              opacity={s.live ? 1 : 0.5}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <g className="field-layer fg-bars" ref={layer(4)} aria-hidden="true">
          <line className="fg-axis" x1="30" y1={H - 60} x2={W - 24} y2={H - 60} vectorEffect="non-scaling-stroke" />
          {g.rects.map((r, i) => (
            <rect
              key={i}
              className="fg-bar"
              x={r.x}
              y={r.y}
              width="18"
              height={r.h}
              rx="2"
              opacity={r.live ? 1 : 0.4}
            />
          ))}
          <path
            className="fg-line fg-report-spark"
            d={g.reportSpark}
            stroke="var(--stage-ink)"
            vectorEffect="non-scaling-stroke"
          />
          {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
            <text key={q} className="fg-tag" x={38 + i * 78} y={H - 40}>
              {q}
            </text>
          ))}
        </g>

        <g className="field-layer fg-decision" ref={layer(5)} aria-hidden="true">
          {g.converge.map((c, i) => (
            <path key={i} className="fg-link is-live" d={c.d} opacity={c.o} vectorEffect="non-scaling-stroke" />
          ))}
          <circle className="fg-ring fg-decision-halo" cx={W / 2} cy={H / 2} r="22" vectorEffect="non-scaling-stroke" />
          <circle className="fg-dot is-live" cx={W / 2} cy={H / 2} r="7" vectorEffect="non-scaling-stroke" />
          <text className="fg-tag" x={W / 2 - 30} y={H / 2 + 48}>
            one decision
          </text>
        </g>

        <rect className="fg-scanline" x="-40" y="0" width="16" height={H} aria-hidden="true" />
      </svg>

      <div className="field-labels" aria-hidden="true">
        {ANNOTATIONS[index].map((a, i) => (
          <span
            key={a.t}
            className="field-label"
            style={{ '--i': i, left: `${a.x}%`, top: `${a.y}%` }}
          >
            <i />
            <b>{a.t}</b>
          </span>
        ))}
      </div>
      </div>
    </div>
  )
}

/**
 * The sticky sequence. Scroll position maps to a float stage index; React only
 * re-renders when the integer index changes, while the rail fill and layer
 * cross-fade are written straight to the DOM each frame.
 */
export default function Story() {
  const root = useRef(null)
  const rail = useRef(null)
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)

  useEffect(() => {
    const node = root.current
    const railNode = rail.current
    if (!node || !railNode) return undefined

    if (reducedMotion()) {
      shared.pipeline = 0
      return undefined
    }

    const paint = (p) => {
      /* Clamped so the final stage stays fully lit at the end of the scroll
         instead of cross-fading past every layer and blanking the field. */
      shared.pipeline = Math.min(N - 1, p * N)
      railNode.style.setProperty('--p', p.toFixed(4))
      const next = Math.min(N - 1, Math.floor(p * N))
      if (next !== indexRef.current) {
        indexRef.current = next
        setIndex(next)
      }
    }

    const trigger = ScrollTrigger.create({
      trigger: node,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => paint(smoothstep(0, 0.94, self.progress)),
      onRefresh: (self) => paint(smoothstep(0, 0.94, self.progress)),
    })

    paint(0)
    return () => trigger.kill()
  }, [])

  const scrubTo = useCallback((target) => {
    const node = root.current
    if (!node) return
    if (reducedMotion()) {
      indexRef.current = target
      setIndex(target)
      shared.pipeline = target + 0.5
      return
    }
    const distance = node.offsetHeight - window.innerHeight
    const top = node.offsetTop + distance * ((target + 0.5) / N)
    window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  return (
    <section className="story" id="story" ref={root} aria-label="The analysis pipeline, stage by stage">
      <h2 className="sr-only">How data becomes a decision</h2>

      <div className="story-sticky wrap">
        <div className="story-panel">
          <div className="story-rail" ref={rail} role="tablist" aria-label="Pipeline stages">
            {pipeline.map((step, i) => (
              <button
                key={step.key}
                type="button"
                role="tab"
                aria-selected={index === i}
                aria-current={index === i ? 'step' : undefined}
                tabIndex={index === i ? 0 : -1}
                style={{ '--stage-c': `var(--stage-${i + 1})` }}
                onClick={() => scrubTo(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault()
                    const next = Math.min(N - 1, index + 1)
                    scrubTo(next)
                    rail.current?.querySelectorAll('button')[next]?.focus()
                  }
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    const next = Math.max(0, index - 1)
                    scrubTo(next)
                    rail.current?.querySelectorAll('button')[next]?.focus()
                  }
                }}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <em>{step.label}</em>
              </button>
            ))}
          </div>

          <div className="story-steps">
            {pipeline.map((step, i) => {
              const relation = i === index ? 'live' : i < index ? 'past' : 'next'
              return (
                <div
                  key={step.key}
                  className="story-step"
                  data-state={relation}
                  role="tabpanel"
                  aria-hidden={relation !== 'live'}
                  style={{ '--stage-c': `var(--stage-${i + 1})` }}
                >
                  <div className="stage-header">
                    <span className="stage-number">{String(i + 1).padStart(2, '0')}</span>
                    <span className="stage-label">{step.label}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <ul className="story-tags">
                    {step.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        <DataField index={index} />
      </div>
    </section>
  )
}
