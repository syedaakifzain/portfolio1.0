/**
 * accretion.js — Formation module
 * Extracted from blackhole_and_singularity.js (Chapter 02 — ORBIT / ABOUT)
 * Pure math, no renderer, no scene, no RAF, no THREE ownership.
 *
 * Visual: Structured accretion — golden-angle spiral, heat-based HSL
 * Params: scale=142.4, spin=3.008, accretion=1.8, warp=0
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

// Scale factor to fit comfortably in shared world space (original is very large)
const WORLD_SCALE = 0.5

export const accretionFormation = {
  id: 'accretion',

  defaults: { scale: 142.4, spin: 3.008, accretion: 1.8, warp: 0 },

  evaluate(i, count, time, posOut, colOut, params) {
    const scale     = ((params && params.scale)     ?? 142.4) * WORLD_SCALE
    const spin      = (params && params.spin)        ?? 3.008
    const accretion = (params && params.accretion)   ?? 1.8
    const warp      = (params && params.warp)        ?? 0

    const u      = (i + 0.5) / count
    const ga     = 2.399963229728653   // golden angle
    const a      = i * ga
    const t      = time * 0.35
    const band   = u * 24.0 - 12.0
    const disk   = 1.0 - Math.abs(Math.sin(band * 0.5))
    const radius = scale * (0.08 + 1.9 * u * u)
    const swirl  = a + spin * Math.log(radius + 1.0) - t * (2.0 + 3.0 * (1.0 - u))
    const grav   = 1.0 / (1.0 + radius * 0.015)
    const bend   = warp * grav * grav
    const x0     = radius * Math.cos(swirl)
    const z0     = radius * Math.sin(swirl)
    const x      = x0 + bend * z0
    const z      = z0 - bend * x0
    const y      = scale * 0.22 * disk * Math.sin(a * 0.17 + t * 4.0) * accretion

    const heat  = 1.0 - Math.min(1.0, radius / (scale * 2.0))
    const hue   = 0.08 + 0.58 * (1.0 - heat)
    const sat   = 0.8 + 0.2 * heat
    const light = 0.15 + 0.55 * Math.pow(heat, 1.5)

    const offset = i * 3
    posOut[offset]     = x
    posOut[offset + 1] = y
    posOut[offset + 2] = z
    hslToRgb(hue, sat, Math.min(1, Math.max(0, light)), colOut, offset)
  },

  evaluateAll(count, time, posOut, colOut, params) {
    for (let i = 0; i < count; i++) {
      this.evaluate(i, count, time, posOut, colOut, params)
    }
  }
}
