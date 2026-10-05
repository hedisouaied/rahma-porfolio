import { forwardRef } from 'react'

/**
 * Section header: eyebrow + display heading on the left, supporting note on the
 * right. Kept as one component so every block shares identical rhythm.
 */
const SectionHead = forwardRef(function SectionHead(
  { eyebrow, title, sub, aside, id, level: Tag = 'h2' },
  ref
) {
  return (
    <div className="head" ref={ref}>
      <div>
        {eyebrow && (
          <p className="eyebrow">
            <span className="eyebrow-line" aria-hidden="true" /> {eyebrow}
          </p>
        )}
        <Tag id={id}>{title}</Tag>
      </div>
      {(sub || aside) && (
        <div className="head-aside">
          {sub && <p className="block-sub">{sub}</p>}
          {aside}
        </div>
      )}
    </div>
  )
})

export default SectionHead
