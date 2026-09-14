/**
 * ProjectCanvas.js
 * Scroll-driven horizontal editorial gallery sliding engine.
 */

export class ProjectCanvas {
  constructor() {
    this._canvas   = document.getElementById('project-canvas')
    this._world    = document.getElementById('project-world')
    this._glow     = document.getElementById('project-glow')

    if (!this._canvas || !this._world) return

    // ── State ──────────────────────────────────────────────────────────────
    this._active       = false
    this._offsetX      = 0
    this._targetOffsetX = 0
    this._maxScrollX   = 0

    // ── Glow state ─────────────────────────────────────────────────────────
    this._glowX        = 0
    this._glowY        = 0
    this._targetGlowX  = 0
    this._targetGlowY  = 0
    this._isTouch      = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    this._computeBounds()

    // Disable dragging cursor styling
    if (this._canvas) {
      this._canvas.style.cursor = 'default'
      this._canvas.style.touchAction = 'auto'
    }

    // ── Glow: track pointer for ambient glow effect (desktop only) ─────────
    if (!this._isTouch && this._glow) {
      this._canvas.addEventListener('mousemove', (e) => {
        this._targetGlowX = e.clientX
        this._targetGlowY = e.clientY
      }, { passive: true })
    }
  }

  _computeBounds() {
    if (!this._world) return
    const worldW = this._world.scrollWidth || 3000
    const vpW = window.innerWidth
    this._maxScrollX = Math.max(0, worldW - vpW)
  }

  /**
   * Compatibility method for ProjectOverlay click checking.
   * Returns false since dragging is disabled.
   */
  wasDragging() {
    return false
  }

  setActive(active) {
    this._active = active
    if (active) {
      this._computeBounds()
    }
  }

  onResize() {
    this._computeBounds()
  }

  /**
   * Per-frame update — called from Experience._tick().
   * Drives scroll sliding, smooth lerping, and cursor glow.
   * @param {number} p - current smoothed scroll progress 0→1
   */
  update(p = 0) {
    if (!this._world) return

    // ── 1. Calculate sliding horizontal translation ────────────────────────
    // Projects chapter start = 0.500, end = 0.666 (from ChapterMap.js)
    const start = 0.500
    const end = 0.666
    
    // Calculate normalized progress within PROJECTS chapter [0, 1]
    let sp = 0
    if (p > start && p < end) {
      sp = (p - start) / (end - start)
    } else if (p >= end) {
      sp = 1.0
    }

    // Target translation (max scroll is computed dynamically)
    this._targetOffsetX = -sp * this._maxScrollX

    // Smooth lerp (0.1 interpolation factor for lag-free premium feel)
    this._offsetX += (this._targetOffsetX - this._offsetX) * 0.1

    // Apply translation
    this._world.style.transform = `translate3d(${this._offsetX.toFixed(1)}px, 0, 0)`

    // ── 2. Cursor glow (desktop only) ───────────────────────────────────────
    if (!this._isTouch && this._glow && this._active) {
      this._glowX += (this._targetGlowX - this._glowX) * 0.08
      this._glowY += (this._targetGlowY - this._glowY) * 0.08
      this._glow.style.transform =
        `translate3d(${this._glowX.toFixed(1)}px, ${this._glowY.toFixed(1)}px, 0)`
      this._glow.style.opacity = '1'
    } else if (this._glow) {
      this._glow.style.opacity = '0'
    }
  }
}

