/**
 * spacetime.js — Formation module
 * Extracted from backhole_c.js (Chapter 03 — DISTORT / DESIGN PHILOSOPHY)
 * Pure math, no renderer, no scene, no RAF, no THREE ownership.
 *
 * Visual: Blue/cyan-biased — relativistic jets, frame-dragging, gravitational lensing
 * Params: gravity=7.129, swirl=3.52, disk=54.2, warp=3.8, jets=3.45
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

// Compress vertical jet extent so it fits the shared camera view
const JET_COMPRESS = 0.45

export const spacetimeFormation = {
  id: 'spacetime',

  defaults: { gravity: 7.129, swirl: 3.52, disk: 54.2, warp: 3.8, jets: 3.45 },

  evaluate(i, count, time, posOut, colOut, params) {
    const gravity = (params && params.gravity) ?? 7.129
    const swirl   = (params && params.swirl)   ?? 3.52
    const disk    = (params && params.disk)    ?? 54.2
    const warp    = (params && params.warp)    ?? 3.8
    const jets    = (params && params.jets)    ?? 3.45

    const fi          = i / count
    const golden      = 2.399963229728653
    const baseAngle   = i * golden
    const timeWarp    = time * (0.15 + gravity * 0.05)
    const radialNoise = Math.sin(i * 0.013 + time * 0.7) * 8.0
    const radius      = disk + fi * 300.0 * 0.18 + radialNoise
    const collapse    = 1.0 / (1.0 + fi * gravity * 0.7)
    const angle       = baseAngle + timeWarp + (1.0 / (radius * 0.03 + 0.2)) * swirl

    let x = Math.cos(angle) * radius * collapse
    let z = Math.sin(angle) * radius * collapse
    const diskWave    = Math.sin(radius * 0.08 - time * 2.0) * 3.0
    let y             = diskWave * Math.exp(-radius * 0.008)

    const singDist = Math.sqrt(x * x + y * y + z * z) + 0.0001
    const lens     = warp / (singDist * 0.08 + 1.0)
    x *= 1.0 + lens
    z *= 1.0 + lens

    const pull = gravity / (singDist * 0.15 + 1.0)
    x -= x * pull * 0.015
    y -= y * pull * 0.015
    z -= z * pull * 0.015

    const jetMask     = Math.abs(Math.sin(fi * 90.0 + time * 0.5))
    const jetStrength = jets * Math.pow(jetMask, 18.0)
    y += (fi - 0.5) * 900.0 * jetStrength * JET_COMPRESS

    const photonRing = Math.exp(-Math.abs(singDist - 18.0) * 0.08)
    x += Math.cos(angle * 4.0 + time * 3.0) * photonRing * 6.0
    z += Math.sin(angle * 4.0 + time * 3.0) * photonRing * 6.0

    const hueShift    = 0.58 + 0.25 * Math.sin(radius * 0.01 - time * 0.2)
    const saturation  = 0.8 - collapse * 0.3
    const brightness  = Math.min(1.0,
      0.15 + photonRing * 0.9 + jetStrength * 0.8 + Math.exp(-singDist * 0.01) * 0.5
    )

    const offset = i * 3
    posOut[offset]     = x
    posOut[offset + 1] = y
    posOut[offset + 2] = z
    hslToRgb(hueShift, saturation, brightness, colOut, offset)
  },

  evaluateAll(count, time, posOut, colOut, params) {
    for (let i = 0; i < count; i++) {
      this.evaluate(i, count, time, posOut, colOut, params)
    }
  }
}
