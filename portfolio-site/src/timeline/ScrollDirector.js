/**
 * ScrollDirector.js
 * Master scroll timeline using native scroll events.
 * Emits normalized progress [0,1] with smooth damping.
 *
 * The body has height 1000vh (set in global.css / index.html).
 * Canvas and all DOM chapters are position:fixed.
 * Scroll progress drives the entire experience.
 */

export class ScrollDirector {
  constructor() {
    this.rawProgress      = 0
    this.smoothedProgress = 0
    this.damping          = 0.075   // lower = smoother but more lag

    // Velocity tracking for glass distortion and transition energy
    this._prevProgress    = 0
    this.velocity         = 0       // progress units per frame
    this._velSmoothed     = 0

    // Chapter indicator elements
    this._chapterEl  = document.getElementById('chapter-index')
    this._chapterBox = document.getElementById('chapter-indicator')
    this._navEl      = document.getElementById('main-nav')

    // Listeners
    this._onScroll = this._onScroll.bind(this)
    window.addEventListener('scroll', this._onScroll, { passive: true })
  }

  _onScroll() {
    const scrollY = window.scrollY
    const docH    = document.documentElement.scrollHeight
    const winH    = window.innerHeight
    const maxScroll = Math.max(1, docH - winH)
    this.rawProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1)
  }

  /** Called once per frame from Experience._tick() */
  update() {
    this._prevProgress    = this.smoothedProgress
    this.smoothedProgress += (this.rawProgress - this.smoothedProgress) * this.damping

    // Velocity (signed, clamped)
    const rawVel = this.smoothedProgress - this._prevProgress
    this._velSmoothed += (rawVel - this._velSmoothed) * 0.3
    this.velocity = Math.max(-0.1, Math.min(0.1, this._velSmoothed))
  }

  /** Update chapter indicator UI */
  updateChapterUI(chapter) {
    if (this._chapterEl && chapter) {
      this._chapterEl.textContent = chapter.label
    }
    // Show nav + chapter indicator once past hero opening
    if (this.smoothedProgress > 0.04) {
      this._chapterBox?.classList.add('visible')
      this._navEl?.classList.add('visible')
    }
  }

  /** Scroll to a chapter by id */
  scrollToChapter(chapterId) {
    const { CHAPTERS } = require('./ChapterMap.js')
    const ch = CHAPTERS.find(c => c.id === chapterId)
    if (!ch) return
    const docH  = document.documentElement.scrollHeight
    const winH  = window.innerHeight
    const maxS  = docH - winH
    window.scrollTo({ top: ch.start * maxS, behavior: 'smooth' })
  }

  dispose() {
    window.removeEventListener('scroll', this._onScroll)
  }
}
