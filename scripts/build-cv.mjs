/**
 * Generates public/cv/Rahma-Jlassi-CV.pdf from src/data/profile.js.
 *
 * A real PDF (base-14 Helvetica, WinAnsi encoding, no dependencies) built
 * strictly from the CV — no invented content. Run with: node scripts/build-cv.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  identity,
  award,
  profile,
  experience,
  education,
  languages,
  skillIndex,
} from '../src/data/profile.js'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, '../public/cv/Rahma-Jlassi-CV.pdf')

/* ------------------------------------------------------------------ text -- */

/* WinAnsiEncoding has no glyph for the general Unicode punctuation we use, so
   map the typographic characters to their WinAnsi code points explicitly. */
const WINANSI = {
  '‘': 0x91,
  '’': 0x92,
  '“': 0x93,
  '”': 0x94,
  '•': 0x95,
  '–': 0x96,
  '—': 0x97,
  '…': 0x85,
  '†': 0x86,
  '€': 0x80,
  '™': 0x99,
}

/* Silently dropping an unmappable glyph would corrupt the CV, so fail loudly. */
const UNMAPPED = []

const esc = (s) =>
  String(s)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, (ch) => {
      if (ch in WINANSI) return `\\${WINANSI[ch].toString(8).padStart(3, '0')}`
      const code = ch.codePointAt(0)
      if (code <= 255) return `\\${code.toString(8).padStart(3, '0')}`
      UNMAPPED.push(ch)
      return '-'
    })

/* Helvetica has no true bold/regular metrics pair here; we lean on size and
   spacing for hierarchy, which keeps the file tiny and universally readable. */
const F = { reg: 'F1', bold: 'F2', mono: 'F3' }

const PAGE = { w: 595.28, h: 841.89, ml: 52, mr: 52 }
const COL = PAGE.w - PAGE.ml - PAGE.mr

class Doc {
  constructor() {
    this.pages = [[]]
    this.y = PAGE.h - 56
    this.page = 1
  }

  /** Every text op is wrapped in its own BT/ET, so the active buffer is simply
   *  the current page's content stream. */
  get ops() {
    return this.pages[this.pages.length - 1]
  }

  text(
    str,
    { font = F.reg, size = 10, color = '0 0 0', x = PAGE.ml, y = this.y, tracking = 0 } = {}
  ) {
    this.ops.push(
      `BT /${font} ${size} Tf ${tracking} Tc ${color} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${esc(
        str
      )}) Tj ET`
    )
  }

  rule({ color = '0.82 0.82 0.84', width = 0.6, gap = 0, inset = 0 } = {}) {
    this.y -= gap
    this.ops.push(
      `${color} RG ${width} w ${(PAGE.ml + inset).toFixed(2)} ${this.y.toFixed(2)} m ${(
        PAGE.ml +
        COL -
        inset
      ).toFixed(2)} ${this.y.toFixed(2)} l S`
    )
    this.y -= 1
  }

  space(n) {
    this.y -= n
  }

  /** Greedy wrap using an average glyph width for the chosen font/size. */
  wrap(
    str,
    { font = F.reg, size = 10, width = COL, x = PAGE.ml, lh = 13.4, color = '0.28 0.29 0.32' } = {}
  ) {
    const avg = size * (font === F.bold ? 0.53 : font === F.mono ? 0.6 : 0.5)
    const perLine = Math.max(8, Math.floor(width / avg))
    const words = String(str).split(/\s+/)
    const lines = []
    let line = ''
    words.forEach((word) => {
      if (!line.length) line = word
      else if (`${line} ${word}`.length <= perLine) line += ` ${word}`
      else {
        lines.push(line)
        line = word
      }
    })
    if (line) lines.push(line)
    lines.forEach((l, i) => {
      this.y -= i === 0 ? 0 : lh
      this.text(l, { font, size, color, x })
    })
    return lines.length
  }

  need(n) {
    if (this.y - n < 64) this.newPage()
  }

  newPage() {
    this.footer()
    this.pages.push([])
    this.page += 1
    this.y = PAGE.h - 56
  }

  footer() {
    const y = 40
    const mark = `${identity.fullName}  ·  ${identity.title}  ·  ${identity.email}  ·  ${identity.phone}`
    this.text(mark, { font: F.mono, size: 7.5, color: '0.55 0.55 0.58', tracking: 0.6, x: PAGE.ml, y })
    this.text(String(this.page).padStart(2, '0'), {
      font: F.mono,
      size: 7.5,
      color: '0.55 0.55 0.58',
      tracking: 0.6,
      x: PAGE.w - PAGE.ml - 18,
      y,
    })
  }

  build() {
    return this.pages
  }
}

const d = new Doc()

/* ------------------------------------------------------------------ head -- */

d.text('RAHMA JLASSI', { font: F.bold, size: 27, color: '0.04 0.05 0.07', tracking: -0.6 })
d.y -= 15
d.text(identity.title.toUpperCase(), {
  font: F.mono,
  size: 9,
  color: '0.62 0.40 0.06',
  tracking: 1.5,
})
d.y -= 12
d.text('DATA & PERFORMANCE INSIGHTS', { font: F.mono, size: 9, color: '0.45 0.46 0.5', tracking: 1.2 })
d.space(12)
d.rule({ color: '0.08 0.09 0.11', width: 1.4 })
d.space(6)

const headBits = [
  identity.location,
  identity.relocation,
  identity.email,
  identity.phone,
  identity.linkedin,
]
d.text(headBits.join('   ·   '), { font: F.mono, size: 8.4, color: '0.4 0.41 0.45' })
d.space(20)

/* --------------------------------------------------------------- profile -- */

const sectionTitle = (label) => {
  d.need(46)
  d.text(label.toUpperCase(), { font: F.mono, size: 8.5, color: '0.62 0.40 0.06', tracking: 1.8 })
  d.space(6)
  d.rule()
  d.space(4)
}

sectionTitle('Profile')
d.wrap(profile.lede, { font: F.bold, size: 11.5, color: '0.08 0.09 0.11', lh: 15, width: COL })
d.space(4)
d.wrap(profile.body, { size: 9.6, lh: 13.6 })
d.space(8)

sectionTitle('Recognition')
d.wrap(`${award.year} — ${award.title.join(' ')}. ${award.note}`, {
  size: 9.6,
  lh: 13.6,
})
d.space(16)

/* ------------------------------------------------------------ experience -- */

sectionTitle('Experience')

experience.forEach((job) => {
  d.need(58)
  d.text(job.role, { font: F.bold, size: 12, color: '0.06 0.07 0.09' })
  d.y -= 11.5
  d.text(`${job.org}  ·  ${job.type}`, { font: F.mono, size: 8.6, color: '0.62 0.40 0.06' })
  d.y -= 10.5
  d.text(job.when, { font: F.mono, size: 8.6, color: '0.45 0.46 0.5' })
  d.space(3)
  d.wrap(job.summary, { size: 9.4, lh: 13, color: '0.28 0.29 0.32' })
  d.space(2)
  job.points.forEach((point) => {
    d.need(16)
    d.y -= 12.6
    d.text('—', { size: 9.2, color: '0.62 0.40 0.06' })
    d.wrap(point, { size: 9.2, lh: 12.6, x: PAGE.ml + 14, width: COL - 14, color: '0.3 0.31 0.34' })
  })
  if (job.milestone) {
    d.need(16)
    d.y -= 12.6
    d.text(`• ${job.milestone.year} — ${job.milestone.label}`, {
      font: F.mono,
      size: 8.8,
      color: '0.62 0.40 0.06',
    })
  }
  d.space(10)
  d.rule({ color: '0.9 0.9 0.92' })
  d.space(8)
})

/* ------------------------------------------------------------- education -- */

sectionTitle('Education')
education.forEach((item) => {
  d.need(44)
  d.text(item.field, { font: F.bold, size: 10.6, color: '0.06 0.07 0.09' })
  d.y -= 11
  d.text(`${item.degree}  ·  ${item.school}`, { font: F.mono, size: 8.6, color: '0.3 0.31 0.34' })
  d.y -= 10.5
  d.text(item.years, { font: F.mono, size: 8.6, color: '0.45 0.46 0.5' })
  d.space(7)
})

/* ---------------------------------------------------------------- skills -- */

sectionTitle('Skills')
skillIndex.forEach((row) => {
  d.need(20)
  d.text(row.group, { font: F.mono, size: 8.4, color: '0.62 0.40 0.06', tracking: 0.8 })
  d.y -= 12
  d.wrap(row.items.join('  ·  '), { size: 9.4, lh: 12.6, color: '0.28 0.29 0.32' })
  d.space(6)
})

/* ------------------------------------------------------------- languages -- */

sectionTitle('Languages')
d.text(
  languages.map((l) => `${l.label} — ${l.level}`).join('     '),
  { font: F.mono, size: 9, color: '0.28 0.29 0.32' }
)

/* ------------------------------------------------------------------ file -- */

const pageStreams = d.build().map((ops) => ops.join('\n'))

const objects = []
const add = (body) => {
  objects.push(body)
  return objects.length
}
const stream = (body) => `<< /Length ${Buffer.byteLength(body, 'latin1')} >>\nstream\n${body}\nendstream`

const fontRegular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
const fontBold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
const fontMono = add('<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>')

/* Each page gets its own content stream, in order. */
const contentIds = pageStreams.map((body) => add(stream(body)))

/* Object layout is fixed up front so every reference resolves:
 *   fonts → one content stream per page → page tree → page objects → catalog/info */
const pageCount = pageStreams.length
const pagesId = objects.length + 1
const firstPageId = pagesId + 1
add(
  `<< /Type /Pages /Kids [${Array.from({ length: pageCount }, (_, i) => `${firstPageId + i} 0 R`).join(
    ' '
  )}] /Count ${pageCount} >>`
)

const fontRes = `<< /Font << /${F.reg} ${fontRegular} 0 R /${F.bold} ${fontBold} 0 R /${F.mono} ${fontMono} 0 R >> >>`
for (let i = 0; i < pageCount; i += 1) {
  add(
    `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE.w} ${PAGE.h}] /Resources ${fontRes} /Contents ${contentIds[i]} 0 R >>`
  )
}

const catalogId = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`)
const infoId = add(
  `<< /Title (${esc(
    'Rahma Jlassi — Business Analyst | Data & Performance Insights'
  )}) /Author (${esc(identity.fullName)}) /Subject (${esc(
    'Curriculum Vitae'
  )}) /Keywords (${esc('Business Analyst, Power BI, DAX, Python, Data Analysis')}) /Creator (rahma-jlassi-portfolio) >>`
)

let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
const offsets = [0]
objects.forEach((body, i) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'))
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
})

const xrefOffset = Buffer.byteLength(pdf, 'latin1')
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
offsets.slice(1).forEach((offset) => {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
})
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R /Info ${infoId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`

mkdirSync(dirname(out), { recursive: true })

if (UNMAPPED.length) {
  const unique = [...new Set(UNMAPPED)]
  throw new Error(
    `Refusing to write a lossy CV: ${unique.length} character(s) have no WinAnsi glyph ` +
      `(${unique.map((c) => `U+${c.codePointAt(0).toString(16).toUpperCase()} "${c}"`).join(', ')}). ` +
      'Add a WINANSI mapping or replace the character in src/data/profile.js.'
  )
}

writeFileSync(out, Buffer.from(pdf, 'latin1'))
console.log(
  `Wrote ${out} — ${pageCount} page(s), ${(Buffer.byteLength(pdf, 'latin1') / 1024).toFixed(1)} kB`
)
