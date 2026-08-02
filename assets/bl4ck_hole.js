import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class ParticlesSwarm {
    constructor(container, count = 20000) {
        this.count = count;
        this.container = container;
        this.speedMult = 1;
        
        // SETUP
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.01);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.set(0, 0, 100);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        // POST PROCESSING
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.strength = 1.8; bloomPass.radius = 0.4; bloomPass.threshold = 0;
        this.composer.addPass(bloomPass);

        // OBJECTS
        this.dummy = new THREE.Object3D();
        this.color = new THREE.Color();
        this.target = new THREE.Vector3();
        this.pColor = new THREE.Color();
        
        this.geometry = new THREE.TetrahedronGeometry(0.25);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.scene.add(this.mesh);
        
        this.positions = [];
        for(let i=0; i<this.count; i++) {
            this.positions.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
            this.mesh.setColorAt(i, this.color.setHex(0x00ff88));
        }
        
        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate);
        const time = this.clock.getElapsedTime() * this.speedMult;
        
        if(this.material.uniforms && this.material.uniforms.uTime) {
            this.material.uniforms.uTime.value = time;
        }

        // API Stubs
        const PARAMS = {"mass":18,"spin":1.8,"turb":2.2,"jet":1.4};
        const addControl = (id, l, min, max, val) => {
             return PARAMS[id] !== undefined ? PARAMS[id] : val;
        };
        const setInfo = () => {};
        const annotate = () => {};
        let THREE_LIB = THREE;
        
        let THREE_LIB = THREE;
        const count = this.count; // Alias for user code
        
        for(let i=0; i<this.count; i++) {
            let target = this.target;
            let color = this.pColor;
            
            // INJECTED CODE
            const mass = addControl("mass", "Singularity Mass", 5, 30, 18);
            const spin = addControl("spin", "Ergosphere Spin", 0.2, 4, 1.8);
            const turb = addControl("turb", "MHD Turbulence", 0, 5, 2.2);
            const jetPow = addControl("jet", "Jet Power", 0, 3, 1.4);
            
            const PI = Math.PI;
            const TAU = PI * 2;
            const n = i / count;
            const t = time;
            const rs = mass * 0.5;
            
            if (n < 0.03) {
                const vi = n / 0.03;
                const golden = 2.399963 * i;
                const phi = Math.acos(1 - 2 * vi);
                const r = rs * (0.3 + 0.7 * Math.pow(vi, 0.8));
                const rot = golden + t * spin * 0.05;
                target.set(
                    r * Math.sin(phi) * Math.cos(rot),
                    r * Math.cos(phi),
                    r * Math.sin(phi) * Math.sin(rot)
                );
                const qFlicker = Math.pow(Math.sin(t * 15 + i * 2.71) * 0.5 + 0.5, 4);
                color.setHSL(0.72, 0.4, 0.003 + 0.015 * qFlicker);
            
            } else if (n < 0.08) {
                const vi = (n - 0.03) / 0.05;
                const rp = rs * 1.5;
                const orbit = vi * TAU * 9 + t * spin * 2.5;
                const inclination = PI * 0.5 + Math.sin(vi * 53 + i * 0.017) * 0.4;
                const wobble = Math.sin(t * 6 + i * 0.19) * 0.6;
                const r = rp + wobble;
                target.set(
                    Math.cos(orbit) * r,
                    Math.sin(inclination) * Math.sin(orbit) * r,
                    Math.cos(inclination) * Math.sin(orbit) * r
                );
                const brightness = 0.65 + 0.35 * Math.abs(Math.sin(t * 10 + i * 0.5));
                color.setHSL(0.55 + 0.08 * Math.sin(t * 4 + vi * 10), 0.4, brightness);
            
            } else if (n < 0.53) {
                const vi = (n - 0.08) / 0.45;
                const rISCO = rs * 3;
                const rOuter = mass * 2.8;
                const rr = rISCO + (rOuter - rISCO) * Math.pow(vi, 0.55);
                const omega = spin / (Math.pow(rr / (rs + 0.01), 1.5) + 0.01);
                const baseAngle = vi * TAU * 15 + t * omega;
                const hScale = 0.2 + 1.8 * Math.pow(rr / rOuter, 1.2);
                const ySpread = (Math.sin(i * 1.618034) * 2 - 1) * hScale;
                const t1 = Math.sin(baseAngle * 3 + t * 2.2 + vi * 25) * turb * 0.4;
                const t2 = Math.cos(baseAngle * 5 + t * 1.7 + vi * 40) * turb * 0.2;
                const t3 = Math.sin(baseAngle * 7 + t * 3 + vi * 60) * turb * 0.1;
                const tY = Math.sin(baseAngle * 4 + t * 2.8) * turb * 0.15 * (rr / rOuter);
                const dx = Math.cos(baseAngle) * rr + t1 + t2;
                const dy = ySpread + tY + t3;
                const dz = Math.sin(baseAngle) * rr + t1 * 0.7 - t2 * 0.5;
                target.set(dx, dy, dz);
                const temp = 1 - Math.pow(vi, 0.45);
                const viewAngle = Math.atan2(dz, dx);
                const beam = 0.6 + 0.4 * Math.cos(viewAngle + PI * 0.3);
                const hue = 0.0 + (1 - temp) * 0.08;
                const sat = 0.95 - temp * 0.6;
                const lum = (0.15 + 0.55 * temp) * beam;
                color.setHSL(hue, sat, Math.max(0.05, lum));
            
            } else if (n < 0.63) {
                const vi = (n - 0.53) / 0.10;
                const arcAngle = vi * TAU * 2 + t * spin * 0.3;
                const arcR = rs * 1.8 + Math.sin(vi * 30 + t) * 1.5;
                const side = vi < 0.5 ? 1 : -1;
                const liftAngle = PI * 0.35 + Math.sin(vi * 17 + t * 0.5) * 0.15;
                target.set(
                    Math.cos(arcAngle) * arcR,
                    side * Math.sin(liftAngle) * arcR * 0.9,
                    Math.sin(arcAngle) * arcR
                );
                const shimmer = 0.5 + 0.5 * Math.sin(t * 6 + vi * 40);
                color.setHSL(0.06, 0.9, 0.3 + 0.4 * shimmer);
            
            } else if (n < 0.80) {
                const vi = (n - 0.63) / 0.17;
                const side = vi < 0.5 ? 1 : -1;
                const ji = vi < 0.5 ? vi * 2 : (vi - 0.5) * 2;
                const maxH = 30 + jetPow * 20;
                const h = ji * maxH;
                const helixAngle = ji * TAU * 4 + t * spin * 2 * side;
                const helixR = (1.5 + ji * 3) * jetPow * 0.5;
                const knot = 0.7 + 0.3 * Math.sin(ji * 30 + t * 3);
                const knotR = helixR * knot;
                const coneR = 0.5 + ji * 4 * jetPow;
                const jx = Math.cos(helixAngle) * (knotR + coneR * Math.sin(i * 0.37));
                const jz = Math.sin(helixAngle) * (knotR + coneR * Math.cos(i * 0.53));
                target.set(jx, side * h, jz);
                const edgeDist = Math.sqrt(jx * jx + jz * jz) / (coneR + knotR + 0.01);
                const jHue = 0.65 + 0.1 * edgeDist;
                const jLum = 0.6 * (1 - ji * 0.5) * jetPow * (0.7 + 0.3 * knot);
                color.setHSL(jHue, 0.7, Math.max(0.05, jLum));
            
            } else if (n < 0.90) {
                const vi = (n - 0.80) / 0.10;
                const armAngle = vi * TAU * 3 + t * spin * 0.4;
                const armR = mass * 3 - vi * mass * 2.5;
                const stretch = Math.pow(vi, 2) * 8;
                const sy = (Math.sin(i * 2.31) - 0.5) * (2 + stretch);
                target.set(
                    Math.cos(armAngle) * armR + Math.sin(t + vi * 10) * 2,
                    sy + Math.sin(armAngle + t) * 1.5,
                    Math.sin(armAngle) * armR + Math.cos(t * 0.7 + vi * 8) * 2
                );
                const streakT = 1 - vi;
                color.setHSL(0.03 + vi * 0.05, 0.85, 0.15 + 0.35 * streakT);
            
            } else {
                const vi = (n - 0.90) / 0.10;
                const hAngle = vi * TAU * 20 + t * 0.3;
                const hR = rs * (1.1 + vi * 15);
                const hPhi = Math.acos(1 - 2 * ((i * 1.618034) % 1));
                const pulse = Math.sin(t * 2 + vi * 50) * 0.5 + 0.5;
                const eR = hR * (0.8 + 0.4 * pulse);
                target.set(
                    eR * Math.sin(hPhi) * Math.cos(hAngle),
                    eR * Math.cos(hPhi),
                    eR * Math.sin(hPhi) * Math.sin(hAngle)
                );
                const fade = Math.pow(pulse, 3);
                color.setHSL(0.55 + 0.15 * Math.sin(i * 0.3), 0.3, 0.02 + 0.12 * fade);
            }
            
            if (i === 0) {
                setInfo("Kerr Black Hole \u2014 Tidal Disruption Event", "Spinning singularity with Keplerian accretion disk, Doppler beaming, relativistic jets, gravitational lensing arcs, and Hawking radiation.");
                annotate("singularity", new THREE.Vector3(0, 0, 0), "Singularity");
                annotate("jet_n", new THREE.Vector3(0, 30 + jetPow * 20, 0), "Polar Jet (N)");
                annotate("jet_s", new THREE.Vector3(0, -(30 + jetPow * 20), 0), "Polar Jet (S)");
                annotate("isco", new THREE.Vector3(rs * 3, 0, 0), "ISCO");
            }
            
            // UPDATE
            this.positions[i].lerp(this.target, 0.1);
            this.dummy.position.copy(this.positions[i]);
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
            this.mesh.setColorAt(i, this.pColor);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor.needsUpdate = true;
        
        this.composer.render();
    }
    
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
        this.scene.remove(this.mesh);
        this.renderer.dispose();
    }
}