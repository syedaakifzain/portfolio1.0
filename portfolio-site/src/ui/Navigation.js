/**
 * Navigation.js
 * Minimal portfolio navigation.
 * Scroll to chapter sections by id when nav links clicked.
 */

import { CHAPTERS } from '../timeline/ChapterMap.js'

export class Navigation {
  constructor() {
    const links = document.querySelectorAll('[data-nav]')
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const target = link.dataset.nav
        this._scrollToSection(target)
      })
    })
  }

  _scrollToSection(sectionId) {
    // Find chapter by domId
    const ch = CHAPTERS.find(c => c.domId === sectionId || c.id === sectionId)
    if (!ch) return

    const docH   = document.documentElement.scrollHeight
    const winH   = window.innerHeight
    const maxS   = Math.max(1, docH - winH)
    const target = ch.start * maxS + (maxS * (ch.end - ch.start) * 0.3)  // aim for 30% into chapter
    window.scrollTo({ top: target, behavior: 'smooth' })
  }
}
