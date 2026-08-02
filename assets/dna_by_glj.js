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
        const PARAMS = {"radius":30,"height":500,"twists":5,"spin":1,"rungs":60};
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
            const radius = addControl("radius", "Helix Radius", 10, 100, 30);
            const height = addControl("height", "Helix Height", 100, 1000, 500);
            const twists = addControl("twists", "Twists", 1, 20, 5);
            const spin = addControl("spin", "Spin Speed", 0.0, 5.0, 1.0);
            const rungs = addControl("rungs", "Base Pairs", 10, 200, 60);
            
            if (i === 0) {
            setInfo("Genetic Algorithm", "DNA double helix calculated via continuous trigonometric functions.");
            }
            
            const p = i / count;
            const group = i % 3;
            
            const isStrand = group < 2 ? 1.0 : 0.0;
            const isRung = group === 2 ? 1.0 : 0.0;
            
            const rungLevel = Math.floor(p * rungs) / rungs;
            const currentP = isStrand * p + isRung * rungLevel;
            
            const y = (currentP - 0.5) * height;
            const theta = currentP * twists * Math.PI * 2 + time * spin;
            
            const strandAngle = theta + group * Math.PI;
            
            const rungPos = Math.sin(i * 9876.543) * radius;
            
            const sX = Math.cos(strandAngle) * radius;
            const sZ = Math.sin(strandAngle) * radius;
            
            const rX = Math.cos(theta) * rungPos;
            const rZ = Math.sin(theta) * rungPos;
            
            const x = isStrand * sX + isRung * rX;
            const z = isStrand * sZ + isRung * rZ;
            
            target.set(x, y, z);
            
            const hue = Math.abs((currentP * 0.8 + time * 0.1) % 1.0);
            const sat = isStrand * 0.9 + isRung * 0.5;
            const lig = isStrand * 0.5 + isRung * 0.8;
            
            color.setHSL(hue, sat, lig);
            
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