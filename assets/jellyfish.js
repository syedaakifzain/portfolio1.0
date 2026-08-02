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
        const PARAMS = {"pulse":2.975,"flow":8.29,"size":22.4};
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
            const pulseSpeed = addControl("pulse", "Pulse Speed", 0.5, 3.0, 1.2);
            const tentacleFlow = addControl("flow", "Tentacle Flow", 1.0, 10.0, 4.5);
            const size = addControl("size", "Jellyfish Size", 5, 25, 12);
            
            if (i === 0) {
            setInfo("Bioluminescent Medusa", "A high-performance particle swarm simulating a deep-sea jellyfish with rhythmic pulsing and flowing tentacles.");
            }
            
            const ratio = i / count;
            const isCap = ratio < 0.3;
            let posX = 0, posY = 0, posZ = 0;
            let hue = 0.5;
            
            const pulse = Math.sin(time * pulseSpeed);
            const pulseMap = (pulse * 0.5 + 0.5);
            
            if (isCap) {
            const capRatio = ratio / 0.3;
            const angle = capRatio * Math.PI * 40.0;
            const radialDist = Math.sqrt(capRatio);
            const wave = Math.sin(capRatio * 2.0 - time * pulseSpeed) * 0.2;
            
            const radius = radialDist * size * (1.0 - wave * 0.5);
            posX = Math.cos(angle) * radius;
            posZ = Math.sin(angle) * radius;
            posY = Math.cos(radialDist * Math.PI * 0.5) * size * 0.6 + (pulse * 0.5);
            
            hue = 0.45 + (capRatio * 0.15);
            } else {
            const tentacleIndex = Math.floor((ratio - 0.3) * 20.0);
            const segmentRatio = ((ratio - 0.3) * 20.0) % 1.0;
            const tAngle = (tentacleIndex / 20.0) * Math.PI * 2.0;
            
            const drift = Math.sin(time + segmentRatio * tentacleFlow + tentacleIndex);
            const sweep = Math.cos(time * 0.5 + segmentRatio) * segmentRatio;
            
            const spread = size * 0.8;
            posX = Math.cos(tAngle) * spread + drift * segmentRatio * 2.0;
            posZ = Math.sin(tAngle) * spread + sweep * segmentRatio * 2.0;
            posY = -segmentRatio * size * 3.0 + (pulseMap * segmentRatio * 2.0);
            
            hue = 0.55 + (segmentRatio * 0.1);
            }
            
            target.set(posX, posY, posZ);
            
            const brightness = isCap ? 0.4 + (pulseMap * 0.2) : 0.5 * (1.0 - (ratio - 0.3));
            color.setHSL(hue, 0.9, brightness);
            
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