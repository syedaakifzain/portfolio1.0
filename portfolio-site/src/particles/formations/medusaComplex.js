/**
 * medusaComplex.js — Formation module
 * Extracted from jellyfish_2.js (Chapter 07 — ADAPT / SKILLS)
 * Pure math, no renderer, no scene, no RAF, no THREE ownership.
 *
 * Visual: Bioluminescent complex jellyfish — bell, internal lobes, central, 32 tentacles
 * Params: scale=5.34, pulse=5, glow=1
 *
 * Skill mapping:
 *  p < 0.40   → bell     → DESIGN (primary)
 *  p < 0.55   → lobes    → CREATIVE DESIGN
 *  p < 0.75   → central  → DEVELOPMENT
 *  p >= 0.75  → tentacles → AI + SECURITY
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

export const medusaComplexFormation = {
  id: 'medusaComplex',

  defaults: { scale: 5.34, pulse: 5, glow: 1 },

  evaluate(i, count, time, posOut, colOut, params) {
    const scale    = (params && params.scale)  ?? 5.34
    const pulseRate = (params && params.pulse) ?? 5
    const bioGlow  = (params && params.glow)   ?? 1

    const p     = i / count
    const theta = i * 2.39996323   // golden angle increment
    const t     = time * pulseRate
    const contraction = Math.pow(Math.max(0, Math.sin(t)), 4)
    const swimOffset  = Math.sin(t - 1.0) * 1.5

    let x = 0, y = 0, z = 0
    let h = 0, s = 0, l = 0

    if (p < 0.40) {
      // ── Bell ─────────────────────────────────────────────────────────────
      const u        = p / 0.40
      y              = 4 - 4 * u
      let r          = 5 * Math.sqrt(Math.max(0, 1 - Math.pow(1 - u, 2)))
      r             += contraction * u * 1.5
      const rimRipple = (u > 0.8)
        ? Math.sin(theta * 30 + time * 3) * 0.15 * (u - 0.8)
        : 0
      r += rimRipple
      x = r * Math.cos(theta)
      z = r * Math.sin(theta)
      h = 0.55 + u * 0.08
      s = 0.9
      l = 0.15 + 0.3 * bioGlow * (1 - u) + contraction * 0.1

    } else if (p < 0.55) {
      // ── Internal lobes ────────────────────────────────────────────────────
      const u    = (p - 0.40) / 0.15
      const lobe = Math.pow(Math.abs(Math.sin(theta * 2)), 0.5)
      y = 2.5 - 2.5 * u
      let r = 2.0 * lobe * Math.sin(u * Math.PI)
      r *= 1.0 - contraction * 0.2
      x = r * Math.cos(theta)
      z = r * Math.sin(theta)
      const pulseGlow = Math.max(0, Math.sin(t + u * 2))
      h = 0.85 + Math.sin(time * 0.5) * 0.05
      s = 1.0
      l = 0.4 + 0.5 * bioGlow * pulseGlow

    } else if (p < 0.75) {
      // ── Central trailing structures ───────────────────────────────────────
      const u      = (p - 0.55) / 0.20
      y            = 1.0 - 9 * u
      const spiral = u * 15 + theta * 0.1
      const wave   = Math.sin(t - u * 6)
      let r = 0.2 + 1.2 * Math.pow(1 - u, 2) + Math.abs(Math.sin(theta * 40)) * 0.3
      r *= 1.0 - contraction * 0.1
      x = r * Math.cos(spiral) + wave * 0.8 * u
      z = r * Math.sin(spiral) + wave * 0.8 * u
      h = 0.85 - u * 0.25
      s = 0.8
      l = 0.1 + 0.6 * bioGlow * Math.pow(1 - u, 2)

    } else {
      // ── 32 tentacles ─────────────────────────────────────────────────────
      const u          = (p - 0.75) / 0.25
      const numTentacles = 32
      const tIndex     = i % numTentacles
      const tAngle     = (tIndex / numTentacles) * Math.PI * 2
      y = 0 - 16 * u
      const baseR = 5 + contraction * 1.5
      const delay = u * 8
      const driftX = Math.sin(t * 0.7 - delay + tIndex) * (1 + u * 5)
      const driftZ = Math.cos(t * 0.9 - delay + tIndex) * (1 + u * 5)
      x = baseR * Math.cos(tAngle) + driftX
      z = baseR * Math.sin(tAngle) + driftZ
      const microOffset = Math.sin(i * 137.5) * 0.06
      x += microOffset
      z += microOffset
      const biolumPulse = Math.max(0, Math.sin(t * 2 - u * 12))
      h = 0.55
      s = 0.9
      l = 0.1 + 0.6 * bioGlow * biolumPulse * Math.pow(1 - u, 0.5)
    }

    y += swimOffset

    const offset = i * 3
    posOut[offset]     = x * scale
    posOut[offset + 1] = y * scale
    posOut[offset + 2] = z * scale
    hslToRgb(h, s, Math.max(0, Math.min(1, l)), colOut, offset)
  },

  evaluateAll(count, time, posOut, colOut, params) {
    for (let i = 0; i < count; i++) {
      this.evaluate(i, count, time, posOut, colOut, params)
    }
  }
}
