/**
 * TransitionDirector.js
 * Drives formation morphs, camera animation, bloom interpolation,
 * cinematic transition effects, and DOM chapter lifecycle from scroll progress.
 *
 * Uses ChapterMap.resolveChapter() to determine current state
 * and pushes commands to FormationController, CameraRig, Renderer, and SceneDOM.
 *
 * Transition effects (matched to PORTFOLIO_FIXES.md §1):
 *   GRAVITY → ORBIT:       Gravitational Lensing Tunnel
 *   ORBIT → DISTORT:       Refractive Glass Slice
 *   DISTORT → SYSTEMS:     Particle Pressure / Compression
 *   SYSTEMS → STRUCTURE:   Liquid Glass Collapse
 *   STRUCTURE → ADAPT:     Kinetic Line Reconstruction
 *   ADAPT → CONNECT:       Bioluminescent Dissolve
 */

import { resolveChapter, CHAPTERS } from './ChapterMap.js'

// Transition type mapping — determines which shader effect to use
const TRANSITION_EFFECTS = {
  'hero→about':       'GRAVITATIONAL_LENSING',
  'about→philosophy': 'REFRACTIVE_SLICE',
  'philosophy→projects': 'PARTICLE_PRESSURE',
  'projects→process': 'LIQUID_GLASS',
  'process→skills':   'KINETIC_LINE',
}

export class TransitionDirector {
  /**
   * @param {FormationController} formationCtrl
   * @param {CameraRig}           cameraRig
   * @param {Renderer}            renderer  (has .setBloom(), transition passes)
   * @param {SceneDOM}            sceneDOM
   * @param {TransitionWipe}      transitionWipe
   */
  constructor(formationCtrl, cameraRig, renderer, sceneDOM, transitionWipe) {
    this._fc     = formationCtrl
    this._cam    = cameraRig
    this._rend   = renderer
    this._dom    = sceneDOM
    this._wipe   = transitionWipe

    this._lastChapterId    = null
    this._lastMorphToId    = null
  }

  /**
   * Per-frame update — driven by scroll progress.
   * @param {number} p        – smoothed scroll progress 0→1
   * @param {number} velocity – scroll velocity
   * @param {number} elapsed  – total elapsed time for shader animations
   */
  update(p, velocity = 0, elapsed = 0) {
    const state = resolveChapter(p)
    const { chapter, fromFormation, toFormation, morphProgress, isMorphing, sectionProgress } = state

    const isProcessSkillsTransition = isMorphing && (
      (chapter.id === 'process' && state.nextChapter.id === 'skills') ||
      (chapter.id === 'skills' && state.nextChapter.id === 'process')
    )

    // ── Formation morph ──────────────────────────────────────────────────────
    if (isMorphing) {
      if (this._lastMorphToId !== toFormation) {
        this._fc.startMorph(toFormation)
        this._lastMorphToId = toFormation
      }
      if (isProcessSkillsTransition) {
        let targetMorphProgress = 0
        if (morphProgress >= 0.20 && morphProgress < 0.50) {
          targetMorphProgress = (morphProgress - 0.20) / 0.30
        } else if (morphProgress >= 0.50) {
          targetMorphProgress = 1.0
        }
        this._fc.setMorphProgress(targetMorphProgress)
      } else {
        this._fc.setMorphProgress(morphProgress)
      }
    } else {
      if (this._lastChapterId !== chapter.id) {
        this._fc.setFormation(chapter.formation)
        this._lastChapterId = chapter.id
        this._lastMorphToId = null
      }
      this._fc.setMorphProgress(0)
    }

    // ── Camera interpolation ─────────────────────────────────────────────────
    const currCam = chapter.camera
    const nextCam = state.nextChapter.camera
    const camMix  = isMorphing ? morphProgress : 0
    const targetPos  = [
      currCam.pos[0]  + (nextCam.pos[0]  - currCam.pos[0])  * camMix,
      currCam.pos[1]  + (nextCam.pos[1]  - currCam.pos[1])  * camMix,
      currCam.pos[2]  + (nextCam.pos[2]  - currCam.pos[2])  * camMix,
    ]
    const targetLook = [
      currCam.look[0] + (nextCam.look[0] - currCam.look[0]) * camMix,
      currCam.look[1] + (nextCam.look[1] - currCam.look[1]) * camMix,
      currCam.look[2] + (nextCam.look[2] - currCam.look[2]) * camMix,
    ]

    // Chapter-specific camera motion
    if (chapter.id === 'process') {
      const dnaY = 200 - sectionProgress * 400
      targetPos[1]  = dnaY
      targetLook[1] = dnaY
    }

    if (chapter.id === 'hero') {
      const advance = sectionProgress * 30
      targetPos[2] = 100 - advance
    }

    this._cam.setTarget(targetPos, targetLook)

    // ── Bloom interpolation ───────────────────────────────────────────────────
    const currBloom = chapter.bloom
    const nextBloom = state.nextChapter.bloom
    const bloomStrength = currBloom.strength + (nextBloom.strength - currBloom.strength) * (isMorphing ? morphProgress : 0)
    this._rend?.setBloom(bloomStrength, currBloom.radius, currBloom.threshold)

    // ── Transition Wipe Shading ───────────────────────────────────────────────
    if (isProcessSkillsTransition && this._wipe) {
      const isLowQuality = this._fc?._ps?._mat?.uniforms?.uPixelRatio?.value <= 1.0
      this._wipe.update(morphProgress, elapsed, isLowQuality)
    } else if (this._wipe) {
      this._wipe.update(0, elapsed)
    }

    // ── Cinematic transition effects ──────────────────────────────────────────
    this._updateTransitionEffects(state, p, elapsed)

    // ── DOM chapter lifecycle ─────────────────────────────────────────────────
    this._dom?.update(state, p, velocity)
  }

  /**
   * Drive the cinematic shader effects based on current transition state.
   * Each transition between chapters uses a unique visual effect.
   */
  _updateTransitionEffects(state, p, elapsed) {
    if (!this._rend) return

    // Reset all effects
    this._rend.resetTransitionEffects()
    this._rend.updateTime(elapsed)

    if (!state.isMorphing) return

    const { chapter, nextChapter, morphProgress } = state
    const key = `${chapter.id}→${nextChapter.id}`
    const effectType = TRANSITION_EFFECTS[key]

    if (!effectType) return

    // Bell curve intensity: peaks at midpoint of transition
    const peak = Math.sin(morphProgress * Math.PI)

    // For geometry wipe transition (process <-> skills), we bypass the kinetic post-processing filter
    if (key === 'process→skills' || key === 'skills→process') {
      return
    }

    switch (effectType) {
      case 'GRAVITATIONAL_LENSING':
        this._rend.gravitationalPass.uniforms.uIntensity.value = peak
        break

      case 'REFRACTIVE_SLICE':
        this._rend.refractivePass.uniforms.uIntensity.value = peak
        this._rend.refractivePass.uniforms.uSlicePos.value = morphProgress
        break

      case 'PARTICLE_PRESSURE':
        this._rend.pressurePass.uniforms.uIntensity.value = peak
        break

      case 'LIQUID_GLASS':
        this._rend.liquidGlassPass.uniforms.uIntensity.value = peak
        break

      case 'KINETIC_LINE':
        this._rend.kineticPass.uniforms.uIntensity.value = peak
        break

      case 'BIOLUMINESCENT':
        this._rend.bioluminescentPass.uniforms.uIntensity.value = peak
        break
    }
  }
}
