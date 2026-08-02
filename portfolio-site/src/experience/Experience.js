/**
 * Experience.js — Root Orchestrator
 * Implements the single rendering pipeline from master plan §23:
 *
 *   ONE WebGLRenderer
 *   ONE primary Scene
 *   ONE CameraRig
 *   ONE EffectComposer
 *   ONE requestAnimationFrame loop
 *
 * Tick loop (from master plan §23):
 *   scrollDirector.update()
 *   transitionDirector.update(progress, velocity)
 *   formationController.update(elapsed)   ← evaluates formation math
 *   cameraRig.update()                    ← smooth camera position
 *   renderer.render()                     ← composer.render()
 *   requestAnimationFrame(tick)
 *
 * Formation modules DO NOT call requestAnimationFrame.
 * Formation modules DO NOT create renderers.
 * Formation modules DO NOT append canvases.
 */

import * as THREE                from 'three'
import { Renderer }              from './Renderer.js'
import { CameraRig }             from './Camera.js'
import { ParticleSystem }        from '../particles/ParticleSystem.js'
import { FormationController }   from '../particles/FormationController.js'
import { FORMATIONS }            from '../particles/FormationController.js'
import { ScrollDirector }        from '../timeline/ScrollDirector.js'
import { TransitionDirector }    from '../timeline/TransitionDirector.js'
import { SceneDOM }              from '../ui/SceneDOM.js'
import { TransitionWipe }        from './TransitionWipe.js'
import { ProjectCanvas }         from '../ui/ProjectCanvas.js'

// Quality tiers per master plan §34
const QUALITY_CONFIG = {
  HIGH:   { particleCount: 14000, dpr: 2,   bloomStrength: 1.6 },
  MEDIUM: { particleCount: 9000,  dpr: 1.5, bloomStrength: 1.4 },
  LOW:    { particleCount: 5000,  dpr: 1,   bloomStrength: 1.1 },
}

let _instance = null

export class Experience {
  constructor(canvas) {
    if (_instance) return _instance
    _instance = this

    this.canvas = canvas
    this.clock  = new THREE.Clock()

    this.sizes = {
      width:      window.innerWidth,
      height:     window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    }

    // Detect quality tier
    this._quality = this._detectQuality()
    const cfg     = QUALITY_CONFIG[this._quality]

    // ── ONE shared scene ──────────────────────────────────────────────────────
    this.scene = new THREE.Scene()
    // Very subtle exponential fog — gives depth to particle formations
    this.scene.fog = new THREE.FogExp2(0x000000, 0.003)

    // ── Core systems ──────────────────────────────────────────────────────────
    this.cameraRig   = new CameraRig(this.scene, this.sizes)
    this.renderer    = new Renderer(canvas, this.scene, this.cameraRig.instance, this.sizes)

    // ── Particle system — initialized BEFORE first render ─────────────────────
    this.particleSystem = new ParticleSystem(cfg.particleCount, this.scene, cfg.dpr)

    // ── Formation controller ──────────────────────────────────────────────────
    this.formationCtrl = new FormationController(this.particleSystem)

    // ── CRITICAL: Prime particles to gargantua formation BEFORE rendering ──────
    // This prevents the green flash and random scatter on frame 0
    this.formationCtrl.setFormation('gargantua')
    this.particleSystem.primeFormation(FORMATIONS['gargantua'], 0)

    // ── Timeline systems ──────────────────────────────────────────────────────
    this.sceneDOM     = new SceneDOM()
    this.scrollDir    = new ScrollDirector()
    this.transitionWipe = new TransitionWipe(this.scene, this.cameraRig.instance)
    this.transDir     = new TransitionDirector(
      this.formationCtrl,
      this.cameraRig,
      this.renderer,
      this.sceneDOM,
      this.transitionWipe,
    )

    // ── Spatial project canvas ──────────────────────────────────────────────────
    this.projectCanvas = new ProjectCanvas()
    this.sceneDOM.setProjectCanvas(this.projectCanvas)

    // ── Resize ────────────────────────────────────────────────────────────────
    window.addEventListener('resize', () => this._onResize())

    // ── Performance monitoring ────────────────────────────────────────────────
    this._frameCount = 0
    this._fpsCheck   = 0
    this._qualityLocked = false   // only lower quality once

    // ── START the ONE animation loop ──────────────────────────────────────────
    this._tick()
  }

  _detectQuality() {
    const w   = window.innerWidth
    const dpr = window.devicePixelRatio
    const mem = navigator.deviceMemory ?? 4  // GB, API not always available

    if (w < 768 || dpr > 2.5 || mem < 2) return 'LOW'
    if (w < 1280 || mem < 4)             return 'MEDIUM'
    return 'HIGH'
  }

  _tick() {
    const delta   = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()

    // ── 1. Update scroll ──────────────────────────────────────────────────────
    this.scrollDir.update()
    const p        = this.scrollDir.smoothedProgress
    const velocity = this.scrollDir.velocity

    // ── 2. Transition director: drives formation morph + camera + bloom + DOM + effects ─
    this.transDir.update(p, velocity, elapsed)

    // ── 3. Formation evaluation (the main CPU particle work) ──────────────────
    this.formationCtrl.update(elapsed)

    // ── 4. Camera smooth damping ──────────────────────────────────────────────
    this.cameraRig.update()

    // ── 4b. Project canvas scroll sliding ─────────────────────────────────────
    this.projectCanvas.update(p)

    // ── 5. Update scroll UI (chapter indicator, nav visibility) ──────────────
    // Resolved from transition director state
    this.scrollDir.updateChapterUI(null)  // chapter updated by SceneDOM

    // ── 6. ONE render ─────────────────────────────────────────────────────────
    this.renderer.render()

    // ── 7. Performance check ──────────────────────────────────────────────────
    this._frameCount++
    this._fpsCheck += delta
    if (this._fpsCheck > 3 && !this._qualityLocked && this._frameCount < 200) {
      const avgFPS = this._frameCount / this._fpsCheck
      if (avgFPS < 40 && this._quality === 'HIGH') {
        console.warn('[Experience] Low FPS detected, dropping to MEDIUM quality')
        this._quality = 'MEDIUM'
        this._qualityLocked = true
        // Note: would need to recreate ParticleSystem with new count — deferred
      }
      this._fpsCheck   = 0
      this._frameCount = 0
    }

    // ── 8. Next frame ─────────────────────────────────────────────────────────
    requestAnimationFrame(() => this._tick())
  }

  _onResize() {
    this.sizes.width      = window.innerWidth
    this.sizes.height     = window.innerHeight
    this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.cameraRig.onResize(this.sizes)
    this.renderer.onResize(this.sizes)
    this.particleSystem.setDPR(this.sizes.pixelRatio)
    this.transitionWipe.onResize(this.sizes)
    this.projectCanvas.onResize()
  }

  static getInstance() { return _instance }
}
