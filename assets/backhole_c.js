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
        const PARAMS = {"gravity":7.129,"swirl":3.52,"disk":54.2,"warp":3.8,"jets":3.45};
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
            const gravity = addControl("gravity", "Gravity Strength", 0.1, 10.0, 4.0);
            const swirl = addControl("swirl", "Frame Dragging", 0.0, 8.0, 3.5);
            const disk = addControl("disk", "Accretion Disk Radius", 20.0, 200.0, 80.0);
            const warp = addControl("warp", "Space Warp", 0.0, 5.0, 2.0);
            const jets = addControl("jets", "Relativistic Jets", 0.0, 5.0, 1.5);
            
            if (i === 0) {
                setInfo(
                    "Black Hole Space-Time Simulation",
                    "Particles spiral into a rotating black hole with accretion disk, relativistic jets, gravitational lensing, and warped space-time."
                );
            
                annotate(
                    "singularity",
                    new THREE.Vector3(0, 0, 0),
                    "Event Horizon"
                );
            }
            
            const fi = i / count;
            const golden = 2.399963229728653;
            const spiral = fi * 300.0;
            
            const baseAngle = i * golden;
            const timeWarp = time * (0.15 + gravity * 0.05);
            
            const radialNoise = Math.sin(i * 0.013 + time * 0.7) * 8.0;
            const radius = disk + spiral * 0.18 + radialNoise;
            
            const collapse = 1.0 / (1.0 + fi * gravity * 0.7);
            
            const angle = baseAngle + timeWarp + (1.0 / (radius * 0.03 + 0.2)) * swirl;
            
            let x = Math.cos(angle) * radius * collapse;
            let z = Math.sin(angle) * radius * collapse;
            
            const diskWave = Math.sin(radius * 0.08 - time * 2.0) * 3.0;
            let y = diskWave * Math.exp(-radius * 0.008);
            
            const singularityDist = Math.sqrt(x * x + y * y + z * z) + 0.0001;
            
            const lens = warp / (singularityDist * 0.08 + 1.0);
            
            x *= 1.0 + lens;
            z *= 1.0 + lens;
            
            const pull = gravity / (singularityDist * 0.15 + 1.0);
            
            x -= x * pull * 0.015;
            y -= y * pull * 0.015;
            z -= z * pull * 0.015;
            
            const jetMask = Math.abs(Math.sin(fi * 90.0 + time * 0.5));
            const jetStrength = jets * Math.pow(jetMask, 18.0);
            
            y += (fi - 0.5) * 900.0 * jetStrength;
            
            const photonRing = Math.exp(-Math.abs(singularityDist - 18.0) * 0.08);
            
            x += Math.cos(angle * 4.0 + time * 3.0) * photonRing * 6.0;
            z += Math.sin(angle * 4.0 + time * 3.0) * photonRing * 6.0;
            
            target.set(x, y, z);
            
            const hueShift = 0.58 + 0.25 * Math.sin(radius * 0.01 - time * 0.2);
            const saturation = 0.8 - collapse * 0.3;
            const brightness =
                0.15 +
                photonRing * 0.9 +
                jetStrength * 0.8 +
                Math.exp(-singularityDist * 0.01) * 0.5;
            
            color.setHSL(
                hueShift,
                saturation,
                Math.min(1.0, brightness)
            );
            
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