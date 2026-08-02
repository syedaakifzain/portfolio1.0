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
        const PARAMS = {"radius":10,"max_r":50,"speed":0.4};
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
            const RS = addControl("radius", "Event Horizon", 5, 20, 10);
            const MAX_R = addControl("max_r", "Disk Radius", 20, 100, 50);
            const SPEED = addControl("speed", "Time Scale", 0.0, 2.0, 0.4);
            
            if (i === 0) {
            setInfo("Gargantua", "Cinematic Supermassive Black Hole & Gravitational Lensing");
            annotate("core", new THREE.Vector3(0, 0, 0), "Singularity Void");
            }
            
            let r1 = (i * 13.579) % 1.0;
            let r2 = (i * 97.531) % 1.0;
            let r3 = (i * 24.680) % 1.0;
            let group = (i * 73.197) % 100.0;
            
            let x = 0, y = 0, z = 0;
            let r = 0, theta = 0;
            let hue = 0.1, sat = 1.0, light = 0.5;
            let localTime = time * SPEED;
            
            if (group < 60) {
            r = RS + (r1 * r1) * (MAX_R - RS);
            let angVel = Math.pow(RS / r, 1.5) * 3.0;
            theta = Math.abs(r2 + localTime * angVel) % 1.0 * Math.PI * 2.0;
            x = r * Math.cos(theta);
            z = r * Math.sin(theta);
            let flare = (r - RS) * 0.08;
            y = (r3 - 0.5) * flare * (1.0 + 0.5 * Math.sin(theta * 4.0));
            } else if (group < 85) {
            r = RS + (r1 * r1) * ((MAX_R * 0.55) - RS);
            let angVel = Math.pow(RS / r, 1.5) * 3.0;
            let frac = Math.abs(r2 + localTime * angVel) % 1.0;
            theta = Math.PI + frac * Math.PI;
            let bx = r * Math.cos(theta);
            let bz = r * Math.sin(theta);
            x = bx;
            if (group < 72.5) {
            y = -bz + (r3 - 0.5) * 1.5;
            } else {
            y = bz + (r3 - 0.5) * 1.5;
            }
            z = bz * 0.25;
            } else if (group < 92) {
            r = RS * 1.01 + r1 * 0.2;
            let phi = r2 * Math.PI * 2.0;
            let costh = (r3 * 2.0) - 1.0;
            let sinth = Math.sqrt(1.0 - costh * costh);
            x = r * sinth * Math.cos(phi);
            y = r * sinth * Math.sin(phi);
            z = r * costh;
            let angle = Math.atan2(z, x) + localTime * 5.0;
            let rxz = Math.sqrt(x * x + z * z);
            x = rxz * Math.cos(angle);
            z = rxz * Math.sin(angle);
            } else {
            r = MAX_R * 1.2 + r1 * MAX_R * 3.0;
            let phi = r2 * Math.PI * 2.0;
            let costh = (r3 * 2.0) - 1.0;
            let sinth = Math.sqrt(1.0 - costh * costh);
            x = r * sinth * Math.cos(phi);
            y = r * sinth * Math.sin(phi);
            z = r * costh;
            }
            
            if (group < 92) {
            let norm = Math.max(0.0, Math.min(1.0, (r - RS) / (MAX_R * 0.5)));
            hue = Math.max(0.0, 0.13 - norm * 0.15);
            sat = 0.8 + norm * 0.2;
            if (norm < 0.05) {
            light = 0.8 + (0.05 - norm) * 4.0;
            } else {
            light = 0.6 * Math.pow(1.0 - norm, 1.6);
            }
            let turb = Math.sin(r * 4.0 - localTime * 2.0) * Math.cos(theta * 5.0);
            light *= 1.0 + turb * 0.3;
            } else {
            hue = 0.6 + r1 * 0.2;
            sat = 0.3;
            light = r2 > 0.98 ? 0.9 : 0.05;
            }
            
            target.set(x, y, z);
            color.setHSL(hue, sat, Math.min(1.0, Math.max(0.0, light)));
            
            
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