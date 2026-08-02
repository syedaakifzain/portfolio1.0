/**
 * Renderer.js
 * ONE WebGLRenderer + ONE EffectComposer + UnrealBloomPass + transition effect passes.
 * Chapter-aware bloom — strength/radius interpolated by TransitionDirector.
 *
 * Architecture rules:
 *  - This is the only file that owns a WebGLRenderer
 *  - Formation modules CANNOT import or call this
 *  - render() is called exactly once per frame from Experience._tick()
 */

import * as THREE                     from 'three'
import { EffectComposer }             from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass }                 from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass }            from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass }                 from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader }      from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import {
  GravitationalLensingShader,
  RefractiveSliceShader,
  ParticlePressureShader,
  LiquidGlassShader,
  KineticLineShader,
  BioluminescentShader,
} from './TransitionEffects.js'

export class Renderer {
  /**
   * @param {HTMLCanvasElement}  canvas
   * @param {THREE.Scene}        scene
   * @param {THREE.Camera}       camera
   * @param {object}             sizes  – { width, height, pixelRatio }
   */
  constructor(canvas, scene, camera, sizes) {
    this._scene  = scene
    this._camera = camera
    this._sizes  = sizes

    // ── WebGL Renderer ────────────────────────────────────────────────────────
    this.instance = new THREE.WebGLRenderer({
      canvas,
      antialias: false,          // bloom handles softness; antialias adds cost
      powerPreference: 'high-performance',
      alpha: false,
    })
    this.instance.setSize(sizes.width, sizes.height)
    this.instance.setPixelRatio(sizes.pixelRatio)
    this.instance.outputColorSpace = THREE.SRGBColorSpace
    this.instance.setClearColor(0x000000, 1)

    // ── Composer ─────────────────────────────────────────────────────────────
    this._composer = new EffectComposer(this.instance)
    this._composer.setSize(sizes.width, sizes.height)
    this._composer.setPixelRatio(sizes.pixelRatio)

    this._renderPass = new RenderPass(scene, camera)
    this._composer.addPass(this._renderPass)

    // ── Bloom pass (chapter-aware defaults — Hero) ────────────────────────────
    this._bloomPass = new UnrealBloomPass(
      new THREE.Vector2(sizes.width, sizes.height),
      1.6,   // strength
      0.4,   // radius
      0,     // threshold — 0 means all bright content contributes
    )
    this._composer.addPass(this._bloomPass)

    // ── Transition effect passes ──────────────────────────────────────────────
    // All start with uIntensity = 0 (disabled). TransitionDirector drives them.
    this.gravitationalPass = new ShaderPass(GravitationalLensingShader)
    this.gravitationalPass.enabled = true
    this._composer.addPass(this.gravitationalPass)

    this.refractivePass = new ShaderPass(RefractiveSliceShader)
    this.refractivePass.enabled = true
    this._composer.addPass(this.refractivePass)

    this.pressurePass = new ShaderPass(ParticlePressureShader)
    this.pressurePass.enabled = true
    this._composer.addPass(this.pressurePass)

    this.liquidGlassPass = new ShaderPass(LiquidGlassShader)
    this.liquidGlassPass.enabled = true
    this._composer.addPass(this.liquidGlassPass)

    this.kineticPass = new ShaderPass(KineticLineShader)
    this.kineticPass.enabled = true
    this._composer.addPass(this.kineticPass)

    this.bioluminescentPass = new ShaderPass(BioluminescentShader)
    this.bioluminescentPass.enabled = true
    this._composer.addPass(this.bioluminescentPass)

    // ── Gamma correction (always last) ────────────────────────────────────────
    this._gammaPass = new ShaderPass(GammaCorrectionShader)
    this._composer.addPass(this._gammaPass)
  }

  /** Called once per frame from Experience._tick() */
  render() {
    this._composer.render()
  }

  /**
   * Set bloom parameters for current chapter.
   * Called by TransitionDirector each frame.
   */
  setBloom(strength, radius, threshold) {
    this._bloomPass.strength  = strength
    this._bloomPass.radius    = radius
    this._bloomPass.threshold = threshold
  }

  /** Reset all transition effect intensities to 0 */
  resetTransitionEffects() {
    this.gravitationalPass.uniforms.uIntensity.value = 0
    this.refractivePass.uniforms.uIntensity.value = 0
    this.pressurePass.uniforms.uIntensity.value = 0
    this.liquidGlassPass.uniforms.uIntensity.value = 0
    this.kineticPass.uniforms.uIntensity.value = 0
    this.bioluminescentPass.uniforms.uIntensity.value = 0
  }

  /** Update time uniforms for all transition effects */
  updateTime(elapsed) {
    this.gravitationalPass.uniforms.uTime.value = elapsed
    this.refractivePass.uniforms.uTime.value = elapsed
    this.pressurePass.uniforms.uTime.value = elapsed
    this.liquidGlassPass.uniforms.uTime.value = elapsed
    this.kineticPass.uniforms.uTime.value = elapsed
    this.bioluminescentPass.uniforms.uTime.value = elapsed
  }

  /** Handle window resize */
  onResize(sizes) {
    this._sizes = sizes
    this.instance.setSize(sizes.width, sizes.height)
    this.instance.setPixelRatio(sizes.pixelRatio)
    this._composer.setSize(sizes.width, sizes.height)
    this._composer.setPixelRatio(sizes.pixelRatio)
    this._bloomPass.resolution.set(sizes.width, sizes.height)
  }

  dispose() {
    this._composer.dispose()
    this.instance.dispose()
  }
}
