/**
 * gargantua.js — Formation module
 * Extracted from black_hole.js (Chapter 01 — GRAVITY / HERO)
 * Pure math, no renderer, no scene, no RAF, no THREE ownership.
 *
 * Visual: Cinematic Supermassive Black Hole & Gravitational Lensing
 * Groups: 60% accretion disk | 25% lensing arcs | 7% event horizon | 8% distant
 */

// ─── Inline HSL → RGB (avoids Color object allocation in hot loop) ───────────
function hslToRgb(h, s, l, out, offset) {
  const a = s * Math.min(l, 1 - l)
  const f = (n) => {
    const k = (n + h * 12) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  out[offset]     = Math.max(0, Math.min(1, f(0)))
  out[offset + 1] = Math.max(0, Math.min(1, f(8)))
  out[offset + 2] = Math.max(0, Math.min(1, f(4)))
}

export const gargantuaFormation = {
  id: 'gargantua',

  // Default parameters (from source PARAMS)
  defaults: { RS: 10, MAX_R: 50, SPEED: 0.4 },

  /**
   * Evaluate a single particle position + color.
   * @param {number} i       – particle index
   * @param {number} count   – total particle count
   * @param {number} time    – elapsed time (seconds, from master clock)
   * @param {Float32Array} posOut – position buffer (count * 3)
   * @param {Float32Array} colOut – color buffer (count * 3)
   * @param {object} params  – optional parameter overrides
   */
  evaluate(i, count, time, posOut, colOut, params) {
    const RS     = (params && params.RS)     ?? 10
    const MAX_R  = (params && params.MAX_R)  ?? 50
    const SPEED  = (params && params.SPEED)  ?? 0.4

    const r1    = (i * 13.579) % 1.0
    const r2    = (i * 97.531) % 1.0
    const r3    = (i * 24.680) % 1.0
    const group = (i * 73.197) % 100.0

    let x = 0, y = 0, z = 0
    let r = 0, theta = 0
    let hue = 0.1, sat = 1.0, light = 0.5
    const localTime = time * SPEED

    if (group < 60) {
      // ── Accretion disk (60%) ─────────────────────────────────────────────
      r = RS + (r1 * r1) * (MAX_R - RS)
      const angVel = Math.pow(RS / r, 1.5) * 3.0
      theta = (Math.abs(r2 + localTime * angVel) % 1.0) * Math.PI * 2.0
      x = r * Math.cos(theta)
      z = r * Math.sin(theta)
      const flare = (r - RS) * 0.08
      y = (r3 - 0.5) * flare * (1.0 + 0.5 * Math.sin(theta * 4.0))

    } else if (group < 85) {
      // ── Gravitational lensing arcs (25%) ─────────────────────────────────
      r = RS + (r1 * r1) * ((MAX_R * 0.55) - RS)
      const angVel2 = Math.pow(RS / r, 1.5) * 3.0
      const frac    = Math.abs(r2 + localTime * angVel2) % 1.0
      theta         = Math.PI + frac * Math.PI
      const bx = r * Math.cos(theta)
      const bz = r * Math.sin(theta)
      x = bx
      y = (group < 72.5) ? (-bz + (r3 - 0.5) * 1.5) : (bz + (r3 - 0.5) * 1.5)
      z = bz * 0.25

    } else if (group < 92) {
      // ── Event horizon shell (7%) ──────────────────────────────────────────
      r = RS * 1.01 + r1 * 0.2
      const phi   = r2 * Math.PI * 2.0
      const costh = (r3 * 2.0) - 1.0
      const sinth = Math.sqrt(1.0 - costh * costh)
      x = r * sinth * Math.cos(phi)
      y = r * sinth * Math.sin(phi)
      z = r * costh
      const angle = Math.atan2(z, x) + localTime * 5.0
      const rxz   = Math.sqrt(x * x + z * z)
      x = rxz * Math.cos(angle)
      z = rxz * Math.sin(angle)

    } else {
      // ── Distant spatial particles (8%) ────────────────────────────────────
      r = MAX_R * 1.2 + r1 * MAX_R * 3.0
      const phi2   = r2 * Math.PI * 2.0
      const costh2 = (r3 * 2.0) - 1.0
      const sinth2 = Math.sqrt(1.0 - costh2 * costh2)
      x = r * sinth2 * Math.cos(phi2)
      y = r * sinth2 * Math.sin(phi2)
      z = r * costh2
    }

    // ── Color ─────────────────────────────────────────────────────────────
    if (group < 92) {
      const norm = Math.max(0.0, Math.min(1.0, (r - RS) / (MAX_R * 0.5)))
      hue  = Math.max(0.0, 0.13 - norm * 0.15)
      sat  = 0.8 + norm * 0.2
      light = (norm < 0.05)
        ? 0.8 + (0.05 - norm) * 4.0
        : 0.6 * Math.pow(1.0 - norm, 1.6)
      const turb = Math.sin(r * 4.0 - localTime * 2.0) * Math.cos(theta * 5.0)
      light *= 1.0 + turb * 0.3
    } else {
      hue   = 0.6 + r1 * 0.2
      sat   = 0.3
      light = r2 > 0.98 ? 0.9 : 0.05
    }

    const offset = i * 3
    posOut[offset]     = x
    posOut[offset + 1] = y
    posOut[offset + 2] = z
    hslToRgb(hue, sat, Math.min(1.0, Math.max(0.0, light)), colOut, offset)
  },

  /** Evaluate all particles into typed arrays */
  evaluateAll(count, time, posOut, colOut, params) {
    for (let i = 0; i < count; i++) {
      this.evaluate(i, count, time, posOut, colOut, params)
    }
  }
}
