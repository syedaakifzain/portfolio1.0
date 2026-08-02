/**
 * TransitionWipe.js
 * Geometry-driven 3D scene wipe / occlusion transition.
 *
 * Implements a large, dark, specular 3D plane that slides diagonally
 * across the camera viewport in local camera space.
 *
 * Visual style: dark near-black polished glass/obsidian slab with specular response,
 * fresnel edge highlighting, and subtle surface variation.
 */

import * as THREE from 'three'

export class TransitionWipe {
  /**
   * @param {THREE.Scene} scene - The main WebGL scene
   * @param {THREE.Camera} camera - The main PerspectiveCamera
   */
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera

    this._initWipe()
  }

  _initWipe() {
    // Create a large plane geometry.
    // At local z = -10, the viewport is approx 11.5 high and 23 wide (at 2.0 aspect).
    // An 80x80 plane covers the viewport completely even when rotated and translated.
    const geometry = new THREE.PlaneGeometry(80, 80)

    // Custom shader material to represent a dark, glass-like polished slab.
    // Avoids using scene lights (since the particle system is unlit).
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false, // Prevents clipping particles behind it incorrectly
      depthTest: false,  // Ensures it renders on top of the particles
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: /* glsl */`
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */`
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          // Base near-black polished obsidian/glass color
          vec3 baseColor = vec3(0.015, 0.015, 0.018);

          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // Specular reflection from virtual light source (camera top-right)
          vec3 lightDir = normalize(vec3(1.2, 1.0, 1.5));
          vec3 halfDir = normalize(lightDir + viewDir);
          float ndh = max(dot(normal, halfDir), 0.0);
          float spec = pow(ndh, 48.0) * 0.15; // Specular shine

          // Fresnel highlight on surface angle
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.12;

          // Subtle animated glass shimmer/grain
          float shimmer = sin(vUv.x * 50.0 + uTime * 1.5) * cos(vUv.y * 50.0 - uTime * 1.2) * 0.004;

          // Combine lighting parts
          vec3 finalColor = baseColor + vec3(spec + fresnel + shimmer);

          // Edge falloff: Soften the boundary very slightly to feel like a thick slab with beveled edges
          float edgeSoftness = 0.05;
          float edgeAlpha = smoothstep(0.0, edgeSoftness, vUv.x) * smoothstep(1.0, 1.0 - edgeSoftness, vUv.x) *
                            smoothstep(0.0, edgeSoftness, vUv.y) * smoothstep(1.0, 1.0 - edgeSoftness, vUv.y);

          // Base opacity is driven by coordinator, scaled by edge alpha
          float alpha = uOpacity * edgeAlpha;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `
    })

    this.mesh = new THREE.Mesh(geometry, this.material)

    // Add to camera so it moves in camera local coordinates
    this.camera.add(this.mesh)

    // Position at z = -10 (directly in front of camera)
    this.mesh.position.set(0, 0, -10)

    // Tilt slightly for 3D perspective and diagonal movement alignment
    this.mesh.rotation.set(0.1, 0.15, -0.6)

    // Start invisible
    this.mesh.visible = false
  }

  /**
   * Update the wipe animation state.
   * @param {number} progress - Transition progress (0 to 1)
   * @param {number} elapsed - Master elapsed time
   * @param {boolean} isMobile - Mobile simplification flag
   */
  update(progress, elapsed, isMobile = false) {
    this.material.uniforms.uTime.value = elapsed

    // Start position: Offscreen top-right
    // Midpoint (0.5): Centered (0, 0)
    // End position: Offscreen bottom-left
    const startX = 65
    const startY = 40
    const endX = -65
    const endY = -40

    const x = THREE.MathUtils.lerp(startX, endX, progress)
    const y = THREE.MathUtils.lerp(startY, endY, progress)

    this.mesh.position.x = x
    this.mesh.position.y = y

    // Opacity: fade in quickly, hold, fade out quickly
    let opacity = 1.0
    if (progress < 0.1) {
      opacity = progress / 0.1
    } else if (progress > 0.9) {
      opacity = (1.0 - progress) / 0.1
    }

    // Simplify on mobile/low-quality by capping opacity slightly (or decreasing calculations)
    this.material.uniforms.uOpacity.value = opacity * (isMobile ? 0.96 : 1.0)

    // Enable/disable rendering based on whether transition is active
    this.mesh.visible = progress > 0.0 && progress < 1.0
  }

  onResize(sizes) {
    this.material.uniforms.uResolution.value.set(sizes.width, sizes.height)
  }

  dispose() {
    this.camera.remove(this.mesh)
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }
}
