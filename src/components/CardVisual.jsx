import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion'
import { onReady } from '../lib/boot'
import { decorative } from '../data/profile'

const W = 240
const H = 160

const toPoints = (values, max, pad = 6) => {
  const step = (W - pad * 2) / (values.length - 1)
  return values.map((v, i) => {
    const x = pad + i * step
    const y = H - 22 - (v / max) * (H - 44)
    return [x, y]
  })
}

const toPath = (points) =>
  points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')

/**
 * The card's visual slot. Stands in for a portrait with a live miniature
 * readout: grid, growing bars, a drawn sparkline and a sweeping scan line.
 * The geometry is decorative — there are no real figures here — which the
 * on-canvas caption states plainly.
 */
export default function CardVisual() {
  const root = useRef(null)

  const bars = decorative.bars
  const barMax = 100
  const barW = 9
  const barGap = (W - 28 - bars.length * barW) / (bars.length - 1)
  const sparkMax = 100
  const spark = toPoints(decorative.sparkline, sparkMax, 14)

  useEffect(() => {
    const node = root.current
    if (!node) return undefined

    if (reducedMotion()) {
      gsap.set('.cv-bar', { scaleY: (i, t) => Number(t.getAttribute('data-h')) })
      gsap.set('.cv-spark', { strokeDasharray: 'none', strokeDashoffset: 0 })
      return undefined
    }

    const barNodes = gsap.utils.toArray('.cv-bar', node)
    const sparkNode = node.querySelector('.cv-spark')
    const areaNode = node.querySelector('.cv-area')
    const scan = node.querySelector('.cv-scan')
    const nodes = gsap.utils.toArray('.cv-node', node)

    const length = sparkNode?.getTotalLength?.() ?? 600
    if (sparkNode) {
      gsap.set(sparkNode, { strokeDasharray: length, strokeDashoffset: length })
    }

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6 })
    tl.fromTo(
      barNodes,
      { scaleY: 0.04, opacity: 0.2 },
      {
        scaleY: (i, t) => Number(t.getAttribute('data-h')),
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.045,
      }
    )
      .to(sparkNode, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, 0.25)
      .fromTo(areaNode, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'none' }, 0.9)
      .fromTo(
        nodes,
        { scale: 0, transformOrigin: '50% 50%' },
        { scale: 1, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.16 },
        1.1
      )
      .fromTo(
        scan,
        { attr: { x: -30 }, opacity: 0 },
        { attr: { x: W + 30 }, opacity: 1, duration: 2.1, ease: 'power1.inOut' },
        1.1
      )
      .to(scan, { opacity: 0, duration: 0.35 }, '-=0.3')
      .to(
        barNodes,
        {
          scaleY: (i, t) => Number(t.getAttribute('data-h2')),
          duration: 0.85,
          ease: 'power2.inOut',
          stagger: 0.04,
        },
        '+=0.3'
      )
      .to([sparkNode, areaNode, ...nodes], { opacity: 0, duration: 0.4 }, '<')
      .to(barNodes, { scaleY: 0.04, opacity: 0.2, duration: 0.5, ease: 'power2.in' }, '<0.1')

    const stop = onReady(() => tl.play(0))
    return () => {
      stop()
      tl.kill()
    }
  }, [])

  return (
    <div className="card-visual" ref={root}>
      <span className="cv-corner tl" aria-hidden="true" />
      <span className="cv-corner tr" aria-hidden="true" />
      <span className="cv-corner bl" aria-hidden="true" />
      <span className="cv-corner br" aria-hidden="true" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Animated decorative readout. Illustrative geometry only — these are not performance figures."
      >
        <g className="cv-grid" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={`h${i}`} x1="10" y1={18 + i * 30} x2={W - 10} y2={18 + i * 30} />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={`v${i}`} x1={14 + i * 42} y1="10" x2={14 + i * 42} y2={H - 18} />
          ))}
        </g>

        <g aria-hidden="true">
          {bars.map((v, i) => {
            const h = (v / barMax) * (H - 60)
            const x = 14 + i * (barW + barGap)
            const accent = i >= bars.length - 3
            return (
              <rect
                key={i}
                className={`cv-bar${accent ? ' is-accent' : ''}`}
                x={x}
                y={H - 22 - h}
                width={barW}
                height={h}
                rx={2}
                data-h={(v / barMax).toFixed(3)}
                data-h2={((v * 0.72 + 12) / barMax).toFixed(3)}
              />
            )
          })}
        </g>

        <path
          className="cv-area"
          d={`${toPath(spark)} L${(W - 14).toFixed(1)} ${H - 22} L14 ${H - 22} Z`}
          opacity="0"
          aria-hidden="true"
        />
        <path className="cv-spark" d={toPath(spark)} aria-hidden="true" />

        <g aria-hidden="true">
          {spark.filter((_, i) => i % 6 === 5).map(([x, y], i) => (
            <circle key={i} className="cv-node" cx={x} cy={y} r="3.2" opacity="0" />
          ))}
        </g>

        <rect className="cv-scan" x="-30" y="10" width="16" height={H - 30} opacity="0" aria-hidden="true" />

        <g aria-hidden="true">
          {decorative.axis.map((label, i) => (
            <text key={label} className="cv-axis" x={16 + i * 62} y={H - 6}>
              {label}
            </text>
          ))}
        </g>
      </svg>

      <span className="badge-status">
        <i aria-hidden="true" />
        Illustrative
      </span>
    </div>
  )
}
