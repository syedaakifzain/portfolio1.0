/**
 * ChapterMap.js
 * Defines the 7-chapter scroll map.
 * Maps normalized scroll progress [0,1] to chapter state:
 *  - active chapter
 *  - formation(s) to render
 *  - morph progress between formations
 *  - section-local progress within the chapter
 *
 * Chapter map:
 *  0.000–0.140  Hero       → gargantua
 *  0.140–0.280  About      → accretion
 *  0.280–0.420  Philosophy → spacetime
 *  0.420–0.570  Projects   → kerr
 *  0.570–0.710  Process    → dna
 *  0.710–0.850  Skills     → medusaComplex
 *  0.850–1.000  Contact    → medusaSimple
 */

export const CHAPTERS = [
  {
    id: 'hero',
    label: '01',
    formation: 'gargantua',
    domId: 'hero',
    start: 0.000,
    end: 0.166,
    camera: { pos: [0, 15, 100], look: [0, 0, 0] },
    bloom: { strength: 0.35, radius: 0.08, threshold: 0.09 },
  },
  {
    id: 'about',
    label: '02',
    formation: 'accretion',
    domId: 'about',
    start: 0.166,
    end: 0.333,
    camera: { pos: [0, 25, 140], look: [0, 0, 0] },
    bloom: { strength: 0.35, radius: 0.08, threshold: 0.09 },
  },
  {
    id: 'philosophy',
    label: '03',
    formation: 'spacetime',
    domId: 'philosophy',
    start: 0.333,
    end: 0.500,
    camera: { pos: [0, 0, 110], look: [0, 0, 0] },
    bloom: { strength: 1.5, radius: 0.35, threshold: 0 },
  },
  {
    id: 'projects',
    label: '04',
    formation: 'kerr',
    domId: 'projects',
    start: 0.500,
    end: 0.666,
    camera: { pos: [5, 20, 110], look: [0, 5, 0] },
    bloom: { strength: 1.2, radius: 0.35, threshold: 0 },
  },
  {
    id: 'process',
    label: '05',
    formation: 'dna',
    domId: 'process',
    start: 0.666,
    end: 0.833,
    camera: { pos: [40, 150, 60], look: [0, 150, 0] },  // looking up the helix
    bloom: { strength: 1.1, radius: 0.4, threshold: 0 },
  },
  {
    id: 'skills',
    label: '06',
    formation: 'medusaComplex',
    domId: 'skills',
    start: 0.833,
    end: 1.000,
    camera: { pos: [0, 10, 80], look: [0, 0, 0] },
    bloom: { strength: 1.4, radius: 0.4, threshold: 0 },
  },
]

// Transition width (fraction of total scroll) for formation morphs
const TRANSITION_HALF = 0.018  // morph straddles the chapter boundary by ±1.8%

/**
 * Resolve scroll progress [0,1] → chapter state.
 * @param {number} p – scroll progress 0→1
 * @returns {ChapterState}
 *
 * @typedef  {object} ChapterState
 * @property {object}  chapter         – current chapter definition
 * @property {object}  prevChapter     – previous chapter (may equal chapter)
 * @property {object}  nextChapter     – next chapter (may equal chapter)
 * @property {number}  sectionProgress – 0→1 within the active chapter
 * @property {number}  morphProgress   – 0→1 formation morph (0=stable,1=fully next)
 * @property {string}  fromFormation   – formation id currently blending FROM
 * @property {string}  toFormation     – formation id currently blending TO
 * @property {boolean} isMorphing      – true when morphProgress > 0 && < 1
 */
export function resolveChapter(p) {
  // Clamp
  p = Math.max(0, Math.min(1, p))

  // Check all chapter boundaries for transitions
  for (let i = 0; i < CHAPTERS.length - 1; i++) {
    const curr = CHAPTERS[i]
    const next = CHAPTERS[i + 1]
    const boundary = next.start
    const transStart = boundary - TRANSITION_HALF
    const transEnd = boundary + TRANSITION_HALF

    if (p >= transStart && p <= transEnd) {
      const morphProgress = (p - transStart) / (transEnd - transStart)
      const sectionProgress = (p - curr.start) / (curr.end - curr.start)
      return {
        chapter: curr,
        prevChapter: i > 0 ? CHAPTERS[i - 1] : curr,
        nextChapter: next,
        sectionProgress: Math.max(0, Math.min(1, sectionProgress)),
        morphProgress: Math.max(0, Math.min(1, morphProgress)),
        fromFormation: curr.formation,
        toFormation: next.formation,
        isMorphing: true,
      }
    }
  }

  // Stable chapter
  let chapter = CHAPTERS[0]
  for (const ch of CHAPTERS) {
    if (p >= ch.start) chapter = ch
    else break
  }

  const sectionProgress = chapter.end > chapter.start
    ? (p - chapter.start) / (chapter.end - chapter.start)
    : 0

  const idx = CHAPTERS.indexOf(chapter)
  return {
    chapter,
    prevChapter: idx > 0 ? CHAPTERS[idx - 1] : chapter,
    nextChapter: idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : chapter,
    sectionProgress: Math.max(0, Math.min(1, sectionProgress)),
    morphProgress: 0,
    fromFormation: chapter.formation,
    toFormation: chapter.formation,
    isMorphing: false,
  }
}

/** Find chapter by id */
export function getChapter(id) {
  return CHAPTERS.find(c => c.id === id) ?? CHAPTERS[0]
}
