/**
 * kerr.js — Formation module
 * Extracted from bl4ck_hole.js (Chapter 04 — SYSTEMS / SELECTED EXPERIMENTS)
 * Pure math, no renderer, no scene, no RAF, no THREE ownership.
 *
 * Visual: Kerr Black Hole — most complex formation.
 * 7 distinct particle regions: singularity, photon orbit, Keplerian disk,
 * lensing arcs, polar jets (N+S), tidal disruption arms, Hawking radiation.
 * Params: mass=18, spin=1.8, turb=2.2, jet=1.4
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

const PI  = Math.PI
const TAU = PI * 2

// Jet height compress to fit camera
const JET_H_SCALE = 0.7

export const kerrFormation = {
  id: 'kerr',

  defaults: { mass: 18, spin: 1.8, turb: 2.2, jet: 1.4 },

  /**
   * Particle region ranges (n = i/count):
   *  0.00–0.03  singularity core
   *  0.03–0.08  photon orbit
   *  0.08–0.53  Keplerian accretion disk
   *  0.53–0.63  lensing arcs
   *  0.63–0.80  polar jets (N+S)
   *  0.80–0.90  tidal disruption arms
   *  0.90–1.00  Hawking radiation shell
   */
  evaluate(i, count, time, posOut, colOut, params) {
    const mass   = (params && params.mass)   ?? 18
    const spin   = (params && params.spin)   ?? 1.8
    const turb   = (params && params.turb)   ?? 2.2
    const jetPow = (params && params.jet)    ?? 1.4

    const n  = i / count
    const t  = time
    const rs = mass * 0.5

    const offset = i * 3
    let x = 0, y = 0, z = 0

    if (n < 0.03) {
      // ── Singularity core ─────────────────────────────────────────────────
      const vi     = n / 0.03
      const golden = 2.399963 * i
      const phi    = Math.acos(1 - 2 * vi)
      const r      = rs * (0.3 + 0.7 * Math.pow(vi, 0.8))
      const rot    = golden + t * spin * 0.05
      x = r * Math.sin(phi) * Math.cos(rot)
      y = r * Math.cos(phi)
      z = r * Math.sin(phi) * Math.sin(rot)
      const qFlicker = Math.pow(Math.sin(t * 15 + i * 2.71) * 0.5 + 0.5, 4)
      hslToRgb(0.72, 0.4, 0.003 + 0.015 * qFlicker, colOut, offset)

    } else if (n < 0.08) {
      // ── Photon orbit ─────────────────────────────────────────────────────
      const vi         = (n - 0.03) / 0.05
      const rp         = rs * 1.5
      const orbit      = vi * TAU * 9 + t * spin * 2.5
      const inclination = PI * 0.5 + Math.sin(vi * 53 + i * 0.017) * 0.4
      const wobble     = Math.sin(t * 6 + i * 0.19) * 0.6
      const r          = rp + wobble
      x = Math.cos(orbit) * r
      y = Math.sin(inclination) * Math.sin(orbit) * r
      z = Math.cos(inclination) * Math.sin(orbit) * r
      const brightness = 0.65 + 0.35 * Math.abs(Math.sin(t * 10 + i * 0.5))
      hslToRgb(0.55 + 0.08 * Math.sin(t * 4 + vi * 10), 0.4, brightness, colOut, offset)

    } else if (n < 0.53) {
      // ── Keplerian accretion disk ──────────────────────────────────────────
      const vi     = (n - 0.08) / 0.45
      const rISCO  = rs * 3
      const rOuter = mass * 2.8
      const rr     = rISCO + (rOuter - rISCO) * Math.pow(vi, 0.55)
      const omega  = spin / (Math.pow(rr / (rs + 0.01), 1.5) + 0.01)
      const baseAngle  = vi * TAU * 15 + t * omega
      const hScale = 0.2 + 1.8 * Math.pow(rr / rOuter, 1.2)
      const ySpread = (Math.sin(i * 1.618034) * 2 - 1) * hScale
      const t1 = Math.sin(baseAngle * 3 + t * 2.2 + vi * 25) * turb * 0.4
      const t2 = Math.cos(baseAngle * 5 + t * 1.7 + vi * 40) * turb * 0.2
      const t3 = Math.sin(baseAngle * 7 + t * 3   + vi * 60) * turb * 0.1
      const tY = Math.sin(baseAngle * 4 + t * 2.8) * turb * 0.15 * (rr / rOuter)
      const dx = Math.cos(baseAngle) * rr + t1 + t2
      const dy = ySpread + tY + t3
      const dz = Math.sin(baseAngle) * rr + t1 * 0.7 - t2 * 0.5
      x = dx; y = dy; z = dz
      const temp      = 1 - Math.pow(vi, 0.45)
      const viewAngle = Math.atan2(dz, dx)
      const beam      = 0.6 + 0.4 * Math.cos(viewAngle + PI * 0.3)
      const hue       = 0.0 + (1 - temp) * 0.08
      const sat2      = 0.95 - temp * 0.6
      const lum       = (0.15 + 0.55 * temp) * beam
      hslToRgb(hue, sat2, Math.max(0.05, lum), colOut, offset)

    } else if (n < 0.63) {
      // ── Lensing arcs ──────────────────────────────────────────────────────
      const vi       = (n - 0.53) / 0.10
      const arcAngle = vi * TAU * 2 + t * spin * 0.3
      const arcR     = rs * 1.8 + Math.sin(vi * 30 + t) * 1.5
      const side     = vi < 0.5 ? 1 : -1
      const liftAngle = PI * 0.35 + Math.sin(vi * 17 + t * 0.5) * 0.15
      x = Math.cos(arcAngle) * arcR
      y = side * Math.sin(liftAngle) * arcR * 0.9
      z = Math.sin(arcAngle) * arcR
      const shimmer = 0.5 + 0.5 * Math.sin(t * 6 + vi * 40)
      hslToRgb(0.06, 0.9, 0.3 + 0.4 * shimmer, colOut, offset)

    } else if (n < 0.80) {
      // ── Polar jets N + S ──────────────────────────────────────────────────
      const vi       = (n - 0.63) / 0.17
      const side     = vi < 0.5 ? 1 : -1
      const ji       = vi < 0.5 ? vi * 2 : (vi - 0.5) * 2
      const maxH     = (30 + jetPow * 20) * JET_H_SCALE
      const h        = ji * maxH
      const helixAngle = ji * TAU * 4 + t * spin * 2 * side
      const helixR   = (1.5 + ji * 3) * jetPow * 0.5
      const knot     = 0.7 + 0.3 * Math.sin(ji * 30 + t * 3)
      const knotR    = helixR * knot
      const coneR    = 0.5 + ji * 4 * jetPow
      const jx       = Math.cos(helixAngle) * (knotR + coneR * Math.sin(i * 0.37))
      const jz       = Math.sin(helixAngle) * (knotR + coneR * Math.cos(i * 0.53))
      x = jx; y = side * h; z = jz
      const edgeDist = Math.sqrt(jx * jx + jz * jz) / (coneR + knotR + 0.01)
      const jHue     = 0.65 + 0.1 * edgeDist
      const jLum     = 0.6 * (1 - ji * 0.5) * jetPow * (0.7 + 0.3 * knot)
      hslToRgb(jHue, 0.7, Math.max(0.05, jLum), colOut, offset)

    } else if (n < 0.90) {
      // ── Tidal disruption arms ─────────────────────────────────────────────
      const vi       = (n - 0.80) / 0.10
      const armAngle = vi * TAU * 3 + t * spin * 0.4
      const armR     = mass * 3 - vi * mass * 2.5
      const stretch  = Math.pow(vi, 2) * 8
      const sy       = (Math.sin(i * 2.31) - 0.5) * (2 + stretch)
      x = Math.cos(armAngle) * armR + Math.sin(t + vi * 10) * 2
      y = sy + Math.sin(armAngle + t) * 1.5
      z = Math.sin(armAngle) * armR + Math.cos(t * 0.7 + vi * 8) * 2
      const streakT = 1 - vi
      hslToRgb(0.03 + vi * 0.05, 0.85, 0.15 + 0.35 * streakT, colOut, offset)

    } else {
      // ── Hawking radiation shell ───────────────────────────────────────────
      const vi     = (n - 0.90) / 0.10
      const hAngle = vi * TAU * 20 + t * 0.3
      const hR     = rs * (1.1 + vi * 15)
      const hPhi   = Math.acos(1 - 2 * ((i * 1.618034) % 1))
      const pulse  = Math.sin(t * 2 + vi * 50) * 0.5 + 0.5
      const eR     = hR * (0.8 + 0.4 * pulse)
      x = eR * Math.sin(hPhi) * Math.cos(hAngle)
      y = eR * Math.cos(hPhi)
      z = eR * Math.sin(hPhi) * Math.sin(hAngle)
      const fade = Math.pow(pulse, 3)
      hslToRgb(0.55 + 0.15 * Math.sin(i * 0.3), 0.3, 0.02 + 0.12 * fade, colOut, offset)
    }

    posOut[offset]     = x
    posOut[offset + 1] = y
    posOut[offset + 2] = z
  },

  evaluateAll(count, time, posOut, colOut, params) {
    for (let i = 0; i < count; i++) {
      this.evaluate(i, count, time, posOut, colOut, params)
    }
  }
}
