/**
 * ParticleSystem.js
 * ONE THREE.Points mesh with soft-circle custom shader.
 * Manages typed array buffers for position/color morph between formations.
 *
 * Architecture contract (from master plan §24–25):
 *  - NO renderer, NO scene, NO RAF — those live in Experience
 *  - Morph is CPU-side prototype: posA, posB, colA, colB → mix → render
 *  - Particles are pre-initialized to first formation (no green frame)
 *  - Uses THREE.AdditiveBlending for glow
 */

import * as THREE from 'three'

// ─── Custom particle shaders ───────────────────────────────────────────────
const VERT = /* glsl */`
  attribute vec3 color;
  varying   vec3 vColor;
  uniform   float uSize;
  uniform   float uPixelRatio;

  void main() {
    vColor = color;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    // Distance-based size: larger closer to camera
    gl_PointSize = uSize * uPixelRatio * (280.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`

const FRAG = /* glsl */`
  varying vec3 vColor;

  void main() {
    // Soft circular sprite
    vec2  uv    = gl_PointCoord - 0.5;
    float dist  = length(uv);
    if (dist > 0.5) discard;
    // Smooth falloff from center to edge
    float alpha = smoothstep(0.5, 0.05, dist);
    gl_FragColor = vec4(vColor * alpha, alpha);
  }
`

export class ParticleSystem {
  /**
   * @param {number}       count    - number of particles
   * @param {THREE.Scene}  scene    - the ONE shared scene
   * @param {number}       dpr      - device pixel ratio (clamped)
   */
  constructor(count, scene, dpr = 1) {
    this.count = count
    this.scene = scene

    // ── Typed arrays — avoids Vector3 objects in the hot loop ───────────────
    // Source positions/colors for formation A (current/from)
    this.posA = new Float32Array(count * 3)
    this.colA = new Float32Array(count * 3)
    // Target positions/colors for formation B (to)
    this.posB = new Float32Array(count * 3)
    this.colB = new Float32Array(count * 3)

    // Current rendered positions (lerped toward the mixed target)
    this._renderPos = new Float32Array(count * 3)
    this._renderCol = new Float32Array(count * 3)

    this._initGeometry(dpr)
  }

  _initGeometry(dpr) {
    this._geo = new THREE.BufferGeometry()
    this._posAttr = new THREE.BufferAttribute(this._renderPos, 3)
    this._colAttr = new THREE.BufferAttribute(this._renderCol, 3)
    this._posAttr.setUsage(THREE.DynamicDrawUsage)
    this._colAttr.setUsage(THREE.DynamicDrawUsage)
    this._geo.setAttribute('position', this._posAttr)
    this._geo.setAttribute('color', this._colAttr)

    this._mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSize: { value: 0.75 },
        uPixelRatio: { value: dpr },
      },
    })

    this.points = new THREE.Points(this._geo, this._mat)
    this.points.frustumCulled = false   // prevent culling on large formations
    this.scene.add(this.points)
  }

  /**
   * Call once BEFORE first render to prime positions from a formation.
   * Prevents the green frame / random-scatter initial state.
   */
  primeFormation(formation, time = 0) {
    formation.evaluateAll(this.count, time, this.posA, this.colA)
    formation.evaluateAll(this.count, time, this.posB, this.colB)
    // Teleport current render state directly — no lerp on frame 0
    this._renderPos.set(this.posA)
    this._renderCol.set(this.colA)
    this._posAttr.needsUpdate = true
    this._colAttr.needsUpdate = true
  }

  /**
   * Per-frame update.
   * @param {number} morphProgress – 0 = fully formationA, 1 = fully formationB
   * @param {number} lerpFactor    – how fast current state chases target (0.06–0.12)
   */
  update(morphProgress, lerpFactor = 0.08) {
    const mp = Math.max(0, Math.min(1, morphProgress))
    const imp = 1.0 - mp
    const rp = this._renderPos
    const rc = this._renderCol
    const pA = this.posA
    const pB = this.posB
    const cA = this.colA
    const cB = this.colB

    for (let i = 0; i < this.count; i++) {
      const idx = i * 3
      // Mixed target
      const tx = pA[idx] * imp + pB[idx] * mp
      const ty = pA[idx + 1] * imp + pB[idx + 1] * mp
      const tz = pA[idx + 2] * imp + pB[idx + 2] * mp
      const tr = cA[idx] * imp + cB[idx] * mp
      const tg = cA[idx + 1] * imp + cB[idx + 1] * mp
      const tb = cA[idx + 2] * imp + cB[idx + 2] * mp
      // Lerp current state toward mixed target
      rp[idx] += (tx - rp[idx]) * lerpFactor
      rp[idx + 1] += (ty - rp[idx + 1]) * lerpFactor
      rp[idx + 2] += (tz - rp[idx + 2]) * lerpFactor
      rc[idx] = tr
      rc[idx + 1] = tg
      rc[idx + 2] = tb
    }

    this._posAttr.needsUpdate = true
    this._colAttr.needsUpdate = true
  }

  /** Set uniform particle size */
  setSize(s) { this._mat.uniforms.uSize.value = s }

  /** Update DPR after resize */
  setDPR(dpr) { this._mat.uniforms.uPixelRatio.value = dpr }

  dispose() {
    this.scene.remove(this.points)
    this._geo.dispose()
    this._mat.dispose()
  }
}
