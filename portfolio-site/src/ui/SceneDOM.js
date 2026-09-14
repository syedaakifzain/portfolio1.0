/**
 * SceneDOM.js
 * Manages chapter DOM lifecycle: INACTIVE → ENTERING → ACTIVE → EXITING → INACTIVE
 *
 * Master plan §30 contract:
 *  - At progress 0.000, only Hero DOM content may be visible
 *  - At progress 0.950, Hero content must NOT be visible
 *  - No accidental global fixed-text overlap
 *  - States use CSS classes + visibility control
 *
 * CSS required:
 *  .scene-overlay { opacity: 0; visibility: hidden; pointer-events: none; }
 *  .scene-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
 *  .scene-overlay.entering { visibility: visible; }
 *  .scene-overlay.exiting { visibility: visible; }
 */

import { CHAPTERS } from '../timeline/ChapterMap.js'

// Visibility window: a chapter's DOM starts appearing this far BEFORE its start
// and disappears this far AFTER its end
const ENTER_BEFORE  = -0.02   // show DOM content 2% AFTER chapter starts (prevents overlap)
const EXIT_AFTER    = -0.02   // hide DOM content 2% BEFORE chapter ends (prevents overlap)

// Per-chapter DOM elements to reveal when chapter becomes active
const CHAPTER_REVEAL_MAP = {
  hero:       ['hero-name', 'hero-statement', 'hero-descriptor', 'scroll-hint'],
  about:      ['about-statement', 'about-bio', ...domWordIds()],
  philosophy: ['philosophy-statement', 'philosophy-body'],
  projects:   ['projects-heading', 'project-canvas', 'project-drag-hint'],

  process:    ['process-opener', ...processStepIds(), 'process-repeat'],
  skills:     ['skills-primary', 'skills-secondary', ...skillGroupIds()],
  contact:    ['contact-q', 'contact-cta', 'contact-actions'],
}

function domWordIds() {
  return ['domain-words']
}
function processStepIds() {
  return Array.from({ length: 6 }, (_, i) => `step-${i}`)  // handled specially
}
function skillGroupIds() {
  return ['skills-groups']
}

export class SceneDOM {
  constructor() {
    // Map: chapter id → <section> element
    this._sections = {}
    for (const ch of CHAPTERS) {
      const el = document.getElementById(ch.domId)
      if (el) this._sections[ch.id] = el
    }

    // Track which chapters have been revealed (for one-time CSS class addition)
    this._revealed = new Set()

    // ProjectCanvas callback — set externally by Experience
    this._projectCanvas = null
    this._projectsActive = false

    // Hero is immediately visible (no scroll needed at start)
    this._initHero()
  }

  /** Set the ProjectCanvas instance for chapter-active signaling */
  setProjectCanvas(pc) {
    this._projectCanvas = pc
  }

  _initHero() {
    const heroSection = this._sections['hero']
    if (heroSection) {
      heroSection.classList.add('active')
      // Stagger reveal of hero content elements
      requestAnimationFrame(() => {
        setTimeout(() => {
          const name = document.getElementById('hero-name')
          const stmt = document.getElementById('hero-statement')
          const desc = document.getElementById('hero-descriptor')
          const hint = document.getElementById('scroll-hint')
          name?.classList.add('revealed')
          setTimeout(() => { stmt?.classList.add('revealed') }, 300)
          setTimeout(() => { desc?.classList.add('revealed') }, 600)
          setTimeout(() => { hint?.classList.add('visible')  }, 900)
        }, 400)
      })
    }
  }

  /**
   * Per-frame update — called from TransitionDirector.update()
   * @param {ChapterState} state   – from resolveChapter()
   * @param {number}       p       – current scroll progress
   * @param {number}       velocity – scroll velocity
   */
  update(state, p, velocity) {
    const { chapter } = state

    // Special coordination for the DOM wipe in process -> skills transition
    const isProcessSkillsTransition = state.isMorphing && (
      (state.chapter.id === 'process' && state.nextChapter.id === 'skills') ||
      (state.chapter.id === 'skills' && state.nextChapter.id === 'process')
    )

    if (isProcessSkillsTransition) {
      const fromId = state.chapter.id
      const toId = state.nextChapter.id
      const mp = state.morphProgress

      // Before midpoint, keep "from" section active.
      // After midpoint, switch to "to" section.
      const activeId = mp < 0.48 ? fromId : toId
      const inactiveId = mp < 0.48 ? toId : fromId

      const activeSection = this._sections[activeId]
      const inactiveSection = this._sections[inactiveId]

      if (activeSection && !activeSection.classList.contains('active')) {
        activeSection.classList.remove('entering', 'exiting')
        activeSection.classList.add('active')
        if (!this._revealed.has(activeId)) {
          this._revealChapterElements(activeId, state.sectionProgress)
          this._revealed.add(activeId)
        }
      }
      if (inactiveSection && inactiveSection.classList.contains('active')) {
        inactiveSection.classList.remove('active')
      }

      // Hide all other sections
      for (const id in this._sections) {
        if (id !== activeId) {
          this._sections[id]?.classList.remove('active')
        }
      }

      // Update indicators
      const chEl = document.getElementById('chapter-index')
      if (chEl) {
        chEl.textContent = mp < 0.48 ? state.chapter.label : state.nextChapter.label
      }
      return
    }

    for (const ch of CHAPTERS) {
      const section = this._sections[ch.id]
      if (!section) continue


      const windowStart = ch.start - ENTER_BEFORE
      const windowEnd   = ch.end   + EXIT_AFTER
      const inWindow    = p >= windowStart && p <= windowEnd

      if (inWindow) {
        if (!section.classList.contains('active')) {
          section.classList.remove('entering', 'exiting')
          section.classList.add('active')
          // Reveal elements when first entering
          if (!this._revealed.has(ch.id)) {
            this._revealChapterElements(ch.id, state.sectionProgress)
            this._revealed.add(ch.id)
          }
        }
      } else {
        if (section.classList.contains('active')) {
          section.classList.remove('active')
        }
      }
    }

    // Special: hide scroll hint once scrolled past hero
    if (p > 0.04) {
      const hint = document.getElementById('scroll-hint')
      hint?.classList.remove('visible')
    }

    // Projects: signal ProjectCanvas active state
    const shouldBeProjectsActive = chapter.id === 'projects'
    if (shouldBeProjectsActive !== this._projectsActive) {
      this._projectsActive = shouldBeProjectsActive
      this._projectCanvas?.setActive(shouldBeProjectsActive)
    }

    // Process: update process step visibility
    if (chapter.id === 'process') {
      this._updateProcessSteps(state.sectionProgress)
    }

    // Chapter indicator
    const chEl = document.getElementById('chapter-index')
    if (chEl) chEl.textContent = chapter.label
  }

  _revealChapterElements(chapterId, sectionProgress) {
    // Generic reveal by adding 'revealed' or 'visible' class to elements
    const map = {
      about: () => {
        document.getElementById('about-statement')?.classList.add('revealed')
        setTimeout(() => { document.getElementById('about-bio')?.classList.add('revealed') }, 300)
        setTimeout(() => {
          document.querySelectorAll('.domain-word').forEach(w => w.classList.add('visible'))
        }, 600)
      },
      philosophy: () => {
        document.getElementById('philosophy-statement')?.classList.add('revealed')
        setTimeout(() => { document.getElementById('philosophy-body')?.classList.add('revealed') }, 400)
      },
      projects: () => {
        document.getElementById('projects-heading')?.classList.add('revealed')
        setTimeout(() => {
          document.querySelectorAll('.project-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('revealed'), i * 80)
          })
        }, 200)
        // Show drag hint
        const hint = document.getElementById('project-drag-hint')
        if (hint) hint.style.opacity = '0.6'
      },
      process: () => {
        document.getElementById('process-opener')?.classList.add('revealed')
      },
      skills: () => {
        document.getElementById('skills-primary')?.classList.add('revealed')
        setTimeout(() => { document.getElementById('skills-secondary')?.classList.add('revealed') }, 250)
        setTimeout(() => {
          document.querySelectorAll('.skill-group').forEach((g, i) => {
            setTimeout(() => g.classList.add('revealed'), i * 100)
          })
        }, 500)
      },
      contact: () => {
        document.getElementById('contact-q')?.classList.add('revealed')
        setTimeout(() => { document.getElementById('contact-cta')?.classList.add('revealed') }, 300)
        setTimeout(() => { document.getElementById('contact-actions')?.classList.add('revealed') }, 600)
      },
    }
    map[chapterId]?.()
  }

  // _updateProjectNodes removed — spatial grid uses drag, not scroll-driven active index

  _updateProcessSteps(sectionProgress) {
    const steps = document.querySelectorAll('.process-step')
    const total = steps.length
    // Reveal steps one by one as camera travels down DNA
    steps.forEach((s, i) => {
      const threshold = (i + 1) / (total + 1)
      if (sectionProgress >= threshold) {
        s.classList.add('active')
      }
    })
    // REPEAT appears near end
    const repeat = document.getElementById('process-repeat')
    if (repeat && sectionProgress > 0.88) {
      repeat.classList.add('revealed')
    }
  }
}
