/**
 * CameraRig.js
 * ONE camera with chapter-aware position targets and smooth damping.
 * Supports subtle pointer parallax (desktop only) with depth-layered influence.
 *
 * Parallax design (per PORTFOLIO_FIXES.md §2):
 *  - Desktop pointer input only
 *  - Smooth interpolation / damping — no direct cursor chasing
 *  - Conceptual depth strengths applied to camera offset
 *  - Respects prefers-reduced-motion
 *  - Disabled on mobile/touch
 *  - No extreme camera rotation or readability loss
 *
 * Architecture: CameraRig does NOT call RAF. It is updated once per frame
 * by Experience._tick() → TransitionDirector → CameraRig.setTarget().
 */

import * as THREE from 'three'

// Damping factor for camera movement
const POSITION_DAMP = 0.05
const LOOK_DAMP     = 0.06

// Pointer parallax — PARALLAX_SCALE controls global intensity
// Individual depth strengths per spec: background 0.05, main 0.15, atmospheric 0.25, UI 0.35
// Camera parallax uses the "main formation" strength (0.15) scaled for visual quality
const PARALLAX_SCALE = 1.0
const POINTER_INFLUENCE = 0.15 * PARALLAX_SCALE
const POINTER_MAX_X = 3.0   // max camera offset in world units (X)
const POINTER_MAX_Y = 2.0   // max camera offset in world units (Y)

// Pointer damping — smooth interpolation, never chase cursor directly
const POINTER_DAMP = 0.04

export class CameraRig {
  /**
   * @param {THREE.Scene} scene
   * @param {object}      sizes – { width, height }
   */
  constructor(scene, sizes) {
    this._scene = scene
    this._sizes = sizes

    // ── Camera ───────────────────────────────────────────────────────────────
    this.instance = new THREE.PerspectiveCamera(
      60,                            // FOV
      sizes.width / sizes.height,    // aspect
      0.1,                           // near
      2000,                          // far
    )
    this.instance.position.set(0, 15, 100)
    this.instance.lookAt(0, 0, 0)
    scene.add(this.instance)

    // ── Targets (set by TransitionDirector) ───────────────────────────────────
    this._targetPos  = new THREE.Vector3(0, 15, 100)
    this._targetLook = new THREE.Vector3(0, 0, 0)

    // ── Current smoothed state ────────────────────────────────────────────────
    this._currentPos  = new THREE.Vector3(0, 15, 100)
    this._currentLook = new THREE.Vector3(0, 0, 0)

    // ── Pointer parallax state ────────────────────────────────────────────────
    // Raw pointer: updated on mousemove (-1 → 1)
    this._pointerRaw = { x: 0, y: 0 }
    // Smoothed pointer: lerped toward raw (never jumps)
    this._pointerSmooth = { x: 0, y: 0 }

    // ── Feature flags ──────────────────────────────────────────────────────────
    this._isMobile = window.matchMedia('(max-width: 768px)').matches
                  || 'ontouchstart' in window
    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Pointer parallax: desktop only, not reduced motion
    if (!this._isMobile && !this._reducedMotion) {
      document.addEventListener('mousemove', (e) => {
        // Normalize to -1 → 1
        this._pointerRaw.x = (e.clientX / window.innerWidth  - 0.5) * 2
        this._pointerRaw.y = (e.clientY / window.innerHeight - 0.5) * 2
      }, { passive: true })
    }
  }

  /**
   * Set camera position and lookAt targets.
   * Called by TransitionDirector each frame.
   */
  setTarget(posArr, lookArr) {
    this._targetPos.set(posArr[0],  posArr[1],  posArr[2])
    this._targetLook.set(lookArr[0], lookArr[1], lookArr[2])
  }

  /** Per-frame update — called from Experience._tick() */
  update() {
    // ── Smooth position ───────────────────────────────────────────────────────
    this._currentPos.lerp(this._targetPos, POSITION_DAMP)
    this._currentLook.lerp(this._targetLook, LOOK_DAMP)

    // ── Smooth pointer interpolation (damped, never chases directly) ──────────
    if (!this._isMobile && !this._reducedMotion) {
      this._pointerSmooth.x += (this._pointerRaw.x - this._pointerSmooth.x) * POINTER_DAMP
      this._pointerSmooth.y += (this._pointerRaw.y - this._pointerSmooth.y) * POINTER_DAMP

      const px = this._pointerSmooth.x * POINTER_MAX_X * POINTER_INFLUENCE
      const py = this._pointerSmooth.y * POINTER_MAX_Y * POINTER_INFLUENCE

      this.instance.position.set(
        this._currentPos.x + px,
        this._currentPos.y - py,
        this._currentPos.z,
      )
    } else {
      this.instance.position.copy(this._currentPos)
    }

    this.instance.lookAt(this._currentLook)
  }

  /** Handle resize */
  onResize(sizes) {
    this._sizes = sizes
    this._isMobile = window.matchMedia('(max-width: 768px)').matches
                  || 'ontouchstart' in window
    this.instance.aspect = sizes.width / sizes.height
    this.instance.updateProjectionMatrix()
  }
}
