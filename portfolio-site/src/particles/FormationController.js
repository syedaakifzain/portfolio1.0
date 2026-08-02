/**
 * FormationController.js
 * Drives which formation equations run each frame and manages the morph.
 *
 * Architecture:
 *  - Holds references to all 8 formation modules (pure math objects)
 *  - Each frame: evaluates active formation(s) into ParticleSystem typed arrays
 *  - During stable chapter: only ONE formation evaluated (cheap)
 *  - During morph: BOTH formations evaluated, particle system mixes them
 *  - morphProgress driven externally by TransitionDirector
 */

import { gargantuaFormation }    from './formations/gargantua.js'
import { accretionFormation }    from './formations/accretion.js'
import { spacetimeFormation }    from './formations/spacetime.js'
import { kerrFormation }         from './formations/kerr.js'
import { dnaFormation }          from './formations/dna.js'
import { medusaComplexFormation } from './formations/medusaComplex.js'
import { medusaSimpleFormation } from './formations/medusaSimple.js'

// Formation registry — order matches chapter sequence
export const FORMATIONS = {
  gargantua:    gargantuaFormation,
  accretion:    accretionFormation,
  spacetime:    spacetimeFormation,
  kerr:         kerrFormation,
  dna:          dnaFormation,
  medusaComplex: medusaComplexFormation,
  medusaSimple: medusaSimpleFormation,
}

// Per-chapter lerp factors — organic scenes use slower lerp for fluid feel
const LERP_FACTORS = {
  gargantua:    0.06,
  accretion:    0.07,
  spacetime:    0.07,
  kerr:         0.07,
  dna:          0.09,
  medusaComplex: 0.08,
  medusaSimple: 0.07,
}

export class FormationController {
  /**
   * @param {ParticleSystem} particleSystem – the ONE shared particle system
   */
  constructor(particleSystem) {
    this._ps           = particleSystem
    this._fromId       = 'gargantua'
    this._toId         = 'gargantua'
    this._morphProgress = 0
    this._time          = 0
  }

  /**
   * Set the active formation immediately (no morph).
   * Used on initial load.
   */
  setFormation(id) {
    this._fromId        = id
    this._toId          = id
    this._morphProgress = 0
  }

  /**
   * Begin a morph from current formation to a new one.
   * TransitionDirector calls this when a chapter transition begins.
   * @param {string} toId – target formation id
   */
  startMorph(toId) {
    // Capture snapshot of current rendered state as "from"
    this._fromId = this._toId
    this._toId   = toId
    this._morphProgress = 0
  }

  /**
   * Set morph progress directly (0 → 1).
   * Called by TransitionDirector each frame.
   */
  setMorphProgress(p) {
    this._morphProgress = Math.max(0, Math.min(1, p))
  }

  /**
   * Per-frame update.
   * @param {number} elapsed – total elapsed time (master clock)
   */
  update(elapsed) {
    this._time = elapsed
    const mp   = this._morphProgress
    const ps   = this._ps

    const fromFormation = FORMATIONS[this._fromId]
    const toFormation   = FORMATIONS[this._toId]

    if (!fromFormation || !toFormation) return

    // ── Evaluate formation A into posA/colA ─────────────────────────────────
    fromFormation.evaluateAll(ps.count, elapsed, ps.posA, ps.colA)

    // ── Evaluate formation B only if morphing ────────────────────────────────
    if (mp > 0 && this._fromId !== this._toId) {
      toFormation.evaluateAll(ps.count, elapsed, ps.posB, ps.colB)
    } else if (this._fromId === this._toId) {
      // Stable: copy A into B so mix always gives correct result
      ps.posB.set(ps.posA)
      ps.colB.set(ps.colA)
    }

    // ── Lerp factor ──────────────────────────────────────────────────────────
    const lf = mp > 0.5
      ? (LERP_FACTORS[this._toId]   ?? 0.08)
      : (LERP_FACTORS[this._fromId] ?? 0.08)

    // ── Particle system mixes and lerps ──────────────────────────────────────
    ps.update(mp, lf)
  }

  get fromId()       { return this._fromId       }
  get toId()         { return this._toId         }
  get morphProgress(){ return this._morphProgress }
}
