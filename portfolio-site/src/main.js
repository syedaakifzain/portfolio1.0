/**
 * main.js — Entry point
 * Bootstraps the Experience, Navigation, ProjectOverlay, and Contact UI.
 * Implements reduced-motion check per master plan §35.
 */

import { Experience }      from './experience/Experience.js'
import { Navigation }      from './ui/Navigation.js'
import { ProjectOverlay }  from './ui/ProjectOverlay.js'

// ── Reduced motion detection ──────────────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReducedMotion) {
  document.documentElement.dataset.reducedMotion = 'true'
}

// ── Always start at the top — disable browser scroll restoration ──────────────
// Without this the browser restores the previous scroll position on reload,
// which immediately jumps the experience to a mid-point chapter.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

// ── Bootstrap the ONE Experience ─────────────────────────────────────────────
const canvas = document.getElementById('webgl-canvas')
const exp    = new Experience(canvas)

// ── UI Modules ────────────────────────────────────────────────────────────────
const nav     = new Navigation()
const overlay = new ProjectOverlay()

// Wire ProjectOverlay to ProjectCanvas for drag-gating
overlay.setProjectCanvas(exp.projectCanvas)

// ── Loader: hide after a short frame delay (particle system is pre-primed) ───
// No async asset loading needed — formations are pure math
const loaderEl = document.getElementById('loader')
if (loaderEl) {
  // Simulate brief initialization period, then reveal
  const barFill  = document.getElementById('loader-bar')
  const barLabel = document.getElementById('loader-label')

  let prog = 0
  const loaderTick = () => {
    prog = Math.min(1, prog + 0.018)
    if (barFill)  barFill.style.width = (prog * 100) + '%'
    if (barLabel) {
      if (prog < 0.4)  barLabel.textContent = 'INITIALISING'
      else if (prog < 0.7) barLabel.textContent = 'CALIBRATING'
      else if (prog < 0.95) barLabel.textContent = 'PARTICLES READY'
      else              barLabel.textContent = 'ENTERING'
    }
    if (prog < 1) {
      requestAnimationFrame(loaderTick)
    } else {
      setTimeout(() => {
        loaderEl.classList.add('hidden')
      }, 200)
    }
  }
  requestAnimationFrame(loaderTick)
}
