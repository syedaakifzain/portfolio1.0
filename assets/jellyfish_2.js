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
        const PARAMS = {"scale":5.34,"pulse":5,"glow":1};
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
            
            const scale = addControl("scale", "Jellyfish Scale", 1, 15, 6);
            const pulseRate = addControl("pulse", "Swim Speed", 0.1, 5, 1.8);
            const bioGlow = addControl("glow", "Bioluminescence", 0, 1, 0.95);
            
            const p = i / count;
            const theta = i * 2.39996323;
            
            let x = 0, y = 0, z = 0;
            let h = 0, s = 0, l = 0;
            
            const t = time * pulseRate;
            const contraction = Math.pow(Math.max(0, Math.sin(t)), 4);
            const swimOffset = Math.sin(t - 1.0) * 1.5;
            
            if (p < 0.40) {
            const u = p / 0.40;
            y = 4 - 4 * u;
            let r = 5 * Math.sqrt(Math.max(0, 1 - Math.pow(1 - u, 2)));
            r += contraction * u * 1.5; 
            
            const rimRipple = (u > 0.8) ? Math.sin(theta * 30 + time * 3) * 0.15 * (u - 0.8) : 0;
            r += rimRipple;
            
            x = r * Math.cos(theta);
            z = r * Math.sin(theta);
            
            h = 0.55 + u * 0.08; 
            s = 0.9;
            l = 0.15 + 0.3 * bioGlow * (1 - u) + contraction * 0.1;
            }
            else if (p < 0.55) {
            const u = (p - 0.40) / 0.15;
            const lobe = Math.pow(Math.abs(Math.sin(theta * 2)), 0.5);
            y = 2.5 - 2.5 * u; 
            
            let r = 2.0 * lobe * Math.sin(u * Math.PI);
            r *= 1.0 - contraction * 0.2; 
            
            x = r * Math.cos(theta);
            z = r * Math.sin(theta);
            
            const pulseGlow = Math.max(0, Math.sin(t + u * 2));
            h = 0.85 + Math.sin(time * 0.5) * 0.05; 
            s = 1.0;
            l = 0.4 + 0.5 * bioGlow * pulseGlow;
            }
            else if (p < 0.75) {
            const u = (p - 0.55) / 0.20;
            y = 1.0 - 9 * u;
            const spiral = u * 15 + theta * 0.1;
            const wave = Math.sin(t - u * 6);
            
            let r = 0.2 + 1.2 * Math.pow(1 - u, 2) + Math.abs(Math.sin(theta * 40)) * 0.3;
            r *= 1.0 - contraction * 0.1;
            
            x = r * Math.cos(spiral) + wave * 0.8 * u;
            z = r * Math.sin(spiral) + wave * 0.8 * u;
            
            h = 0.85 - u * 0.25;
            s = 0.8;
            l = 0.1 + 0.6 * bioGlow * Math.pow(1 - u, 2);
            }
            else {
            const u = (p - 0.75) / 0.25;
            const numTentacles = 32;
            const tIndex = i % numTentacles;
            const tAngle = (tIndex / numTentacles) * Math.PI * 2;
            
            y = 0 - 16 * u; 
            
            const baseR = 5 + contraction * 1.5;
            
            const delay = u * 8;
            const driftX = Math.sin(t * 0.7 - delay + tIndex) * (1 + u * 5);
            const driftZ = Math.cos(t * 0.9 - delay + tIndex) * (1 + u * 5);
            
            x = baseR * Math.cos(tAngle) + driftX;
            z = baseR * Math.sin(tAngle) + driftZ;
            
            const microOffset = Math.sin(i * 137.5) * 0.06;
            x += microOffset;
            z += microOffset;
            
            const biolumPulse = Math.max(0, Math.sin(t * 2 - u * 12));
            
            h = 0.55;
            s = 0.9;
            l = 0.1 + 0.6 * bioGlow * biolumPulse * Math.pow(1 - u, 0.5);
            }
            y += swimOffset;
            
            target.set(x * scale, y * scale, z * scale);
            color.setHSL(h, s, Math.max(0, Math.min(1, l)));
            
            if (i === 0) {
            setInfo("Bioluminescent Medusa", "Deep-sea jellyfish simulation with fluid dynamics, pulsating bell, and trailing bioluminescent tentacles.");
            annotate("bell", new THREE.Vector3(0, 5 * scale, 5 * scale), "Pulsating Bell");
            annotate("core", new THREE.Vector3(0, 2 * scale, 0), "Bioluminescent Gonads");
            annotate("tentacles", new THREE.Vector3(4 * scale, -10 * scale, 0), "Neural Tentacles");
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