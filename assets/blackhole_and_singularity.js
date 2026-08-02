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
        const PARAMS = {"scale":142.4,"spin":3.008,"accretion":1.8,"warp":0};
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
            const scale = addControl("scale", "Event Horizon", 20, 200, 90);
            const spin = addControl("spin", "Spin", 0.2, 8.0, 3.0);
            const accretion = addControl("accretion", "Accretion Disk", 0.0, 2.0, 1.0);
            const warp = addControl("warp", "Space Warp", 0.0, 3.0, 1.2);
            
            if (i === 0) {
            setInfo(
            "Black Hole Singularity",
            "A relativistic accretion disk spiraling into a warped gravitational well."
            );
            annotate("bh", new THREE.Vector3(0, 0, 0), "Singularity");
            }
            
            const u = (i + 0.5) / count;
            const ga = 2.399963229728653;
            const a = i * ga;
            
            const t = time * 0.35;
            const band = u * 24.0 - 12.0;
            
            const disk = 1.0 - Math.abs(Math.sin(band * 0.5));
            const radius = scale * (0.08 + 1.9 * u * u);
            
            const swirl = a + spin * Math.log(radius + 1.0) - t * (2.0 + 3.0 * (1.0 - u));
            
            const grav = 1.0 / (1.0 + radius * 0.015);
            const bend = warp * grav * grav;
            
            const x0 = radius * Math.cos(swirl);
            const z0 = radius * Math.sin(swirl);
            
            const x = x0 + bend * z0;
            const z = z0 - bend * x0;
            
            const y = scale * 0.22 * disk * Math.sin(a * 0.17 + t * 4.0) * accretion;
            
            target.set(x, y, z);
            
            const heat = 1.0 - Math.min(1.0, radius / (scale * 2.0));
            const hue = 0.08 + 0.58 * (1.0 - heat);
            const sat = 0.8 + 0.2 * heat;
            const light = 0.15 + 0.55 * Math.pow(heat, 1.5);
            
            color.setHSL(hue, sat, light);
            
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