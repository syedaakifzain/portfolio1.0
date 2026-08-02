/**
 * dna.js — Formation module
 * Extracted from dna_by_glj.js (Chapter 06 — STRUCTURE / MY DESIGN DNA)
 * Pure math, no renderer, no scene, no RAF, no THREE ownership.
 *
 * Visual: Double helix — 2 strands + rung particles
 * Params: radius=30, height=500, twists=5, spin=1, rungs=60
 *
 * The camera travels vertically along the 500-unit helix.
 * Process checkpoints: QUESTION(+200) EXPLORE(+120) DESIGN(+40) BUILD(-40) BREAK(-120) IMPROVE(-200)
 */

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

export const dnaFormation = {
  id: 'dna',

  defaults: { radius: 30, height: 500, twists: 5, spin: 1, rungs: 60 },

  /**
   * Group classification by index % 3:
   *  0 = strand A (cyan)
   *  1 = strand B (purple)
   *  2 = rung connector (bright bridge)
   */
  evaluate(i, count, time, posOut, colOut, params) {
    const radius = (params && params.radius) ?? 30
    const height = (params && params.height) ?? 500
    const twists = (params && params.twists) ?? 5
    const spin   = (params && params.spin)   ?? 1
    const rungs  = (params && params.rungs)  ?? 60

    const p        = i / count
    const group    = i % 3              // 0 = strandA, 1 = strandB, 2 = rung
    const isStrand = group < 2 ? 1.0 : 0.0
    const isRung   = group === 2 ? 1.0 : 0.0
    const rungLevel = Math.floor(p * rungs) / rungs
    const currentP  = isStrand * p + isRung * rungLevel
    const y         = (currentP - 0.5) * height
    const theta     = currentP * twists * Math.PI * 2 + time * spin
    const strandAngle = theta + group * Math.PI
    const rungPos   = Math.sin(i * 9876.543) * radius
    const sX        = Math.cos(strandAngle) * radius
    const sZ        = Math.sin(strandAngle) * radius
    const rX        = Math.cos(theta) * rungPos
    const rZ        = Math.sin(theta) * rungPos
    const x         = isStrand * sX + isRung * rX
    const z         = isStrand * sZ + isRung * rZ

    const hue = Math.abs((currentP * 0.8 + time * 0.1) % 1.0)
    const sat = isStrand * 0.9 + isRung * 0.5
    const lig = isStrand * 0.5 + isRung * 0.8

    const offset = i * 3
    posOut[offset]     = x
    posOut[offset + 1] = y
    posOut[offset + 2] = z
    hslToRgb(hue, sat, lig, colOut, offset)
  },

  evaluateAll(count, time, posOut, colOut, params) {
    for (let i = 0; i < count; i++) {
      this.evaluate(i, count, time, posOut, colOut, params)
    }
  }
}
