/**
 * medusaSimple.js — Formation module
 * Extracted from jellyfish.js (Chapter 08 — CONNECT / CONTACT)
 * Pure math, no renderer, no scene, no RAF, no THREE ownership.
 *
 * Visual: Simplified bioluminescent medusa — cap + 20 tentacles
 * Params: pulse=2.975, flow=8.29, size=22.4
 *
 * Narrative: The quiet final living form. Simpler silhouette, calmer energy.
 * CTA hover creates localized particle attraction toward button region.
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

export const medusaSimpleFormation = {
  id: 'medusaSimple',

  defaults: { pulse: 2.975, flow: 8.29, size: 22.4 },

  /**
   * Particle groups:
   *  ratio < 0.30 → cap/bell
   *  ratio >= 0.30 → 20 tentacles
   */
  evaluate(i, count, time, posOut, colOut, params) {
    const pulseSpeed    = (params && params.pulse) ?? 2.975
    const tentacleFlow  = (params && params.flow)  ?? 8.29
    const size          = (params && params.size)  ?? 22.4

    const ratio   = i / count
    const isCap   = ratio < 0.3
    const pulse   = Math.sin(time * pulseSpeed)
    const pulseMap = (pulse * 0.5 + 0.5)

    let posX = 0, posY = 0, posZ = 0
    let hue  = 0.5

    if (isCap) {
      const capRatio  = ratio / 0.3
      const angle     = capRatio * Math.PI * 40.0
      const radialDist = Math.sqrt(capRatio)
      const wave      = Math.sin(capRatio * 2.0 - time * pulseSpeed) * 0.2
      const radius    = radialDist * size * (1.0 - wave * 0.5)
      posX = Math.cos(angle) * radius
      posZ = Math.sin(angle) * radius
      posY = Math.cos(radialDist * Math.PI * 0.5) * size * 0.6 + (pulse * 0.5)
      hue  = 0.45 + capRatio * 0.15

    } else {
      const tentacleIndex = Math.floor((ratio - 0.3) * 20.0)
      const segmentRatio  = ((ratio - 0.3) * 20.0) % 1.0
      const tAngle        = (tentacleIndex / 20.0) * Math.PI * 2.0
      const drift         = Math.sin(time + segmentRatio * tentacleFlow + tentacleIndex)
      const sweep         = Math.cos(time * 0.5 + segmentRatio) * segmentRatio
      const spread        = size * 0.8
      posX = Math.cos(tAngle) * spread + drift * segmentRatio * 2.0
      posZ = Math.sin(tAngle) * spread + sweep * segmentRatio * 2.0
      posY = -segmentRatio * size * 3.0 + (pulseMap * segmentRatio * 2.0)
      hue  = 0.55 + segmentRatio * 0.1
    }

    const brightness = isCap
      ? 0.4 + pulseMap * 0.2
      : 0.5 * (1.0 - Math.max(0, ratio - 0.3))

    const offset = i * 3
    posOut[offset]     = posX
    posOut[offset + 1] = posY
    posOut[offset + 2] = posZ
    hslToRgb(hue, 0.9, Math.max(0, Math.min(1, brightness)), colOut, offset)
  },

  evaluateAll(count, time, posOut, colOut, params) {
    for (let i = 0; i < count; i++) {
      this.evaluate(i, count, time, posOut, colOut, params)
    }
  }
}
