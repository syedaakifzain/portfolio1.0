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
        const PARAMS = {"waveSpeed":0.8,"vortexSize":16.5,"swell":1.22,"matte":0.5};
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
            const waveSpeed = addControl("waveSpeed", "Vortex Speed", 0, 2, 0.8);
            const vortexSize = addControl("vortexSize", "Whirlpool Radius", 5, 25, 16.5);
            const swellHigh = addControl("swell", "Ocean Swell", 0, 2, 1.22);
            const matteFactor = addControl("matte", "Glow Reduction", 0.005, 0.5, 0.5);
            
            const seaCount = Math.floor(count * 0.6); 
            const shipCount = count - seaCount;
            
            if (i === 0) {
                setInfo("Galleon 'Ironwood'", "Level deck geometry, integrated wooden prow, and aero-billowed sails.");
            }
            
            let px = 0, py = 0, pz = 0, r = 0, g = 0, b = 0;
            const t = time * waveSpeed;
            
            const getVortex = (d, time) => {
                const falloff = Math.exp(-Math.pow(d / vortexSize, 2));
                const twist = ( (vortexSize * 3) / (d + 2) ) * falloff + (time * 3.0 * falloff);
                const sink = -(22 / (d + 1.5)) * falloff;
                return { twist, sink, falloff };
            };
            
            if (i < seaCount) {
                const ratio = i / seaCount;
                const d = Math.sqrt(ratio) * 65; 
                const initialAngle = i * 2.39996;
                const fx = getVortex(d, t);
                const currentAngle = initialAngle + fx.twist;
                px = Math.cos(currentAngle) * d;
                pz = Math.sin(currentAngle) * d;
                py = fx.sink + Math.sin(d * 0.9 - t * 6) * 0.4 * fx.falloff + Math.sin(px * 0.15 + t) * Math.cos(pz * 0.15 + t * 0.7) * swellHigh;
                const br = fx.falloff * 0.3 + (py > 0 ? py * 0.03 : 0);
                r = 0.005 + br * 0.3; g = 0.02 + br * 0.5; b = 0.08 + br * 0.8;
            } else {
                const sI = i - seaCount;
                const shipRatio = sI / shipCount;
                
                const orbitRadius = vortexSize * 0.75;
                const afx = getVortex(orbitRadius, t);
                const shipAngle = t * 0.4 + afx.twist;
                const anchorX = Math.cos(shipAngle) * orbitRadius;
                const anchorZ = Math.sin(shipAngle) * orbitRadius;
                const anchorY = afx.sink + Math.sin(anchorX * 0.15 + t) * Math.cos(anchorZ * 0.15 + t * 0.7) * swellHigh;
            
                let lx = 0, ly = 0, lz = 0;
                const jitter = (sI * 0.5) % 0.04 - 0.02;
            
                if (shipRatio < 0.45) {
                    // 1. THE HULL (Deep Wood Tones)
                    const hR = shipRatio / 0.45;
                    const zPos = (hR - 0.5) * 18;
                    // Tapering logic: Make the front (positive Z) much sharper for a 'pointy' prow
                    const taper = zPos > 0 ? (1.0 - (zPos / 9.5)) : Math.sqrt(Math.max(0, 1.0 - Math.pow(zPos / 9.2, 2)));
                    
                    const hAngle = (sI * 0.13) % Math.PI; 
                    lx = Math.cos(hAngle) * (2.8 * taper);
                    ly = 1.6 - Math.sin(hAngle) * (2.2 * taper);
                    
                    // Stern height (Tail) - Reduced elevation for realism
                    if (zPos < -5) ly += Math.abs(zPos + 5) * 0.25;
                    lz = zPos;
                    r = matteFactor * 0.6; g = r * 0.5; b = r * 0.3;
                } 
                else if (shipRatio < 0.6) {
                    // 2. THE DECKS (Solid Horizontal Surface)
                    const dR = (shipRatio - 0.45) / 0.15;
                    const zPos = (dR - 0.5) * 17.5;
                    const taper = zPos > 0 ? (1.0 - (zPos / 9.5)) : Math.sqrt(Math.max(0, 1.0 - Math.pow(zPos / 9, 2)));
                    
                    lx = ((sI % 40) / 20 - 1) * (2.6 * taper);
                    ly = (zPos < -5.5) ? 2.8 : 1.8; // Poop deck is only slightly higher now
                    lz = zPos;
                    r = matteFactor * 0.75; g = r * 0.55; b = r * 0.35;
                }
                else {
                    // 3. THE SAILS & MASTS
                    const rR = (shipRatio - 0.6) / 0.4;
                    const mast = Math.floor(rR * 3);
                    const mZ = [6, 0, -6][mast];
                    
                    const vRatio = (sI % 500) / 500;
                    // Billow math: X arcs outward, Z arcs forward
                    const billowX = Math.sin((sI % 50) / 50 * Math.PI);
                    const billowZ = Math.sin(vRatio * Math.PI); 
                    
                    const sW = (3.4 - vRatio * 1.8) * billowX;
                    lx = ((sI % 50) / 25 - 1) * sW;
                    ly = 2.4 + (vRatio * 12);
                    lz = mZ + (billowZ * 1.2) + (billowX * 0.6); // Forced forward curve
            
                    if ((sI % 120) < 5) { // Vertical Masts
                        lx = 0; lz = mZ; r = 0.04; g = 0.02; b = 0.01;
                    } else { // Cloth
                        const shade = 0.8 + billowZ * 0.2;
                        r = matteFactor * 2.8 * shade; g = r * 0.92; b = r * 0.82;
                    }
                }
            
                const heading = shipAngle + Math.PI / 1.75;
                const lean = 0.5 * afx.falloff;
                const rx = lx * Math.cos(heading) - lz * Math.sin(heading);
                const rz = lx * Math.sin(heading) + lz * Math.cos(heading);
                
                px = anchorX + rx * 4.0;
                pz = anchorZ + rz * 4.0;
                py = anchorY + (ly * 4.0 * Math.cos(lean) - rx * Math.sin(lean)) + Math.sin(t * 1.5) * 0.2;
            }
            
            target.set(px, py, pz);
            color.setRGB(r, g, b);
            
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