/**
 * TransitionEffects.js
 * Custom GLSL post-processing passes for cinematic chapter transitions.
 * All effects are driven as ShaderPass instances on the single EffectComposer.
 *
 * Architecture: These passes are added to Renderer's EffectComposer.
 * TransitionDirector sets uniforms each frame based on scroll progress.
 * No additional renderers, scenes, or RAF loops are created.
 */

import * as THREE from 'three'

// ── Gravitational Lensing Tunnel (GRAVITY → ORBIT) ──────────────────────────
// Center-weighted radial distortion that pulls the scene toward a focal point
export const GravitationalLensingShader = {
  name: 'GravitationalLensing',
  uniforms: {
    tDiffuse:    { value: null },
    uIntensity:  { value: 0.0 },   // 0 = off, 1 = full effect
    uCenter:     { value: new THREE.Vector2(0.5, 0.5) },
    uTime:       { value: 0.0 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uIntensity;
    uniform vec2  uCenter;
    uniform float uTime;
    varying vec2  vUv;

    void main() {
      vec2 delta = vUv - uCenter;
      float dist = length(delta);

      // Gravitational lensing: radial pull toward center
      float pullStrength = uIntensity * 0.35;
      float tunnel = pullStrength / (dist + 0.15);
      vec2 distorted = vUv - delta * tunnel * 0.08;

      // Chromatic aberration at the edges during distortion
      float chromatic = uIntensity * 0.012;
      vec4 colR = texture2D(tDiffuse, distorted + delta * chromatic);
      vec4 colG = texture2D(tDiffuse, distorted);
      vec4 colB = texture2D(tDiffuse, distorted - delta * chromatic);
      vec4 col = vec4(colR.r, colG.g, colB.b, 1.0);

      // Darken edges during transition (tunnel vignette)
      float vignette = 1.0 - smoothstep(0.2, 0.8, dist) * uIntensity * 0.6;
      col.rgb *= vignette;

      gl_FragColor = col;
    }
  `,
}

// ── Refractive Glass Slice (ORBIT → DISTORT) ────────────────────────────────
// A moving transparent band that refracts/bends the scene
export const RefractiveSliceShader = {
  name: 'RefractiveSlice',
  uniforms: {
    tDiffuse:     { value: null },
    uIntensity:   { value: 0.0 },
    uSlicePos:    { value: 0.0 },  // 0→1 position of the slice across screen
    uTime:        { value: 0.0 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uIntensity;
    uniform float uSlicePos;
    uniform float uTime;
    varying vec2  vUv;

    void main() {
      float sliceWidth = 0.15;
      float dist = abs(vUv.x - uSlicePos);
      float inSlice = smoothstep(sliceWidth, 0.0, dist);

      // Refraction offset inside the slice
      float refract = inSlice * uIntensity * 0.06;
      vec2 offset = vec2(
        sin(vUv.y * 18.0 + uTime * 2.0) * refract,
        cos(vUv.x * 14.0 + uTime * 1.5) * refract * 0.5
      );

      vec2 uv = vUv + offset;
      vec4 col = texture2D(tDiffuse, uv);

      // Subtle glass edge highlight
      float edge = smoothstep(sliceWidth, sliceWidth * 0.3, dist) *
                   smoothstep(0.0, sliceWidth * 0.3, dist);
      col.rgb += vec3(edge * uIntensity * 0.15);

      gl_FragColor = col;
    }
  `,
}

// ── Particle Pressure / Compression (DISTORT → SYSTEMS) ─────────────────────
// Compresses scene toward center creating density impression
export const ParticlePressureShader = {
  name: 'ParticlePressure',
  uniforms: {
    tDiffuse:    { value: null },
    uIntensity:  { value: 0.0 },
    uTime:       { value: 0.0 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uIntensity;
    uniform float uTime;
    varying vec2  vUv;

    void main() {
      vec2 center = vec2(0.5);
      vec2 delta = vUv - center;
      float dist = length(delta);

      // Compression toward center
      float compress = 1.0 - uIntensity * 0.3;
      vec2 uv = center + delta * compress;

      // Slight radial blur to enhance pressure feeling
      vec4 col = vec4(0.0);
      float samples = 4.0;
      for (float i = 0.0; i < 4.0; i++) {
        float t = i / samples;
        vec2 sampleUv = mix(uv, vUv, t * uIntensity * 0.15);
        col += texture2D(tDiffuse, sampleUv);
      }
      col /= samples;

      // Intensify brightness in center (density glow)
      float glow = (1.0 - dist) * uIntensity * 0.2;
      col.rgb += glow;

      gl_FragColor = col;
    }
  `,
}

// ── Liquid Glass Collapse (SYSTEMS → STRUCTURE) ─────────────────────────────
// Smooth glass-like distortion effect before DNA structure resolves
export const LiquidGlassShader = {
  name: 'LiquidGlass',
  uniforms: {
    tDiffuse:    { value: null },
    uIntensity:  { value: 0.0 },
    uTime:       { value: 0.0 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uIntensity;
    uniform float uTime;
    varying vec2  vUv;

    void main() {
      // Liquid glass ripple distortion
      float wave1 = sin(vUv.y * 12.0 + uTime * 3.0) * cos(vUv.x * 8.0 + uTime * 2.0);
      float wave2 = sin(vUv.x * 10.0 - uTime * 2.5) * cos(vUv.y * 14.0 + uTime * 1.8);
      vec2 distortion = vec2(wave1, wave2) * uIntensity * 0.025;

      // Chromatic split for refractive look
      float chromatic = uIntensity * 0.008;
      vec4 colR = texture2D(tDiffuse, vUv + distortion + vec2(chromatic, 0.0));
      vec4 colG = texture2D(tDiffuse, vUv + distortion);
      vec4 colB = texture2D(tDiffuse, vUv + distortion - vec2(chromatic, 0.0));

      vec4 col = vec4(colR.r, colG.g, colB.b, 1.0);

      // Glass surface sheen
      float sheen = abs(wave1 + wave2) * uIntensity * 0.08;
      col.rgb += sheen;

      gl_FragColor = col;
    }
  `,
}

// ── Kinetic Line Reconstruction (STRUCTURE → ADAPT) ─────────────────────────
// Directional motion lines / streak effect
export const KineticLineShader = {
  name: 'KineticLine',
  uniforms: {
    tDiffuse:    { value: null },
    uIntensity:  { value: 0.0 },
    uDirection:  { value: new THREE.Vector2(1.0, 0.3) }, // motion direction
    uTime:       { value: 0.0 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uIntensity;
    uniform vec2  uDirection;
    uniform float uTime;
    varying vec2  vUv;

    void main() {
      vec2 dir = normalize(uDirection);

      // Motion blur along direction
      vec4 col = vec4(0.0);
      float samples = 6.0;
      float spread = uIntensity * 0.04;
      for (float i = 0.0; i < 6.0; i++) {
        float t = (i / samples - 0.5) * 2.0;
        vec2 offset = dir * t * spread;
        col += texture2D(tDiffuse, vUv + offset);
      }
      col /= samples;

      // Streaking line artifacts
      float streak = sin(dot(vUv, dir) * 80.0 + uTime * 5.0);
      streak = smoothstep(0.7, 1.0, abs(streak)) * uIntensity * 0.1;
      col.rgb += streak;

      gl_FragColor = col;
    }
  `,
}

// ── Bioluminescent Dissolve (ADAPT → CONNECT) ───────────────────────────────
// Organic glow dissolve with soft edges
export const BioluminescentShader = {
  name: 'BioluminescentDissolve',
  uniforms: {
    tDiffuse:    { value: null },
    uIntensity:  { value: 0.0 },
    uTime:       { value: 0.0 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uIntensity;
    uniform float uTime;
    varying vec2  vUv;

    void main() {
      vec4 col = texture2D(tDiffuse, vUv);

      // Organic noise pattern for dissolve
      float n1 = sin(vUv.x * 20.0 + uTime * 1.2) * cos(vUv.y * 15.0 - uTime * 0.8);
      float n2 = sin(vUv.y * 25.0 + uTime * 1.5) * cos(vUv.x * 18.0 + uTime);
      float noise = (n1 + n2) * 0.5;

      // Bioluminescent glow — brighter particles get organic glow
      float luminance = dot(col.rgb, vec3(0.299, 0.587, 0.114));
      float glow = luminance * uIntensity * 0.35 * (1.0 + noise * 0.5);

      // Soft color shift toward blue-green (bioluminescent)
      vec3 bioColor = vec3(0.2, 0.8, 0.7);
      col.rgb += bioColor * glow;

      // Dissolve edges
      float dissolve = smoothstep(0.3, 0.7, noise + (1.0 - uIntensity * 2.0));
      col.rgb *= mix(1.0, dissolve, uIntensity * 0.3);

      gl_FragColor = col;
    }
  `,
}
