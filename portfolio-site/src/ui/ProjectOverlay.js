/**
 * ProjectOverlay.js
 * Restrained glassmorphic project detail overlay.
 * Uses keyboard-accessible dialog pattern.
 */

const PROJECT_DATA = [
  {
    index: '01',
    title: 'Face Recognition Attendance',
    tags: 'COMPUTER VISION · PYTHON · AUTOMATION',
    status: 'Completed',
    image: '/projects/Face_r.jpg',
    overview: 'An automated attendance logging system that uses real-time computer vision to detect, track, and recognize student faces in a classroom setting, removing manual logs entirely.',
    features: [
      'Real-time live video capture and face detection utilizing dlib\'s HOG and CNN models',
      '128-dimensional facial embedding generation via deep learning models',
      'Automated attendance logging in Excel sheets utilizing OpenPyXL with instant timestamps',
      'Interactive visual overlay showcasing detection boxes and student names with low latency'
    ],
    challenges: 'Ensuring robust recognition under varying ambient lighting conditions, camera angles, and partial face occlusions (like glasses or masks) while maintaining a high frame rate.',
    learned: 'Gained hands-on experience with facial embedding spaces, deep learning-based object detection pipelines, and optimized real-time visual streams in Python.',
    github: null,
    liveDemo: null
  },
  {
    index: '02',
    title: 'Quantum EEG Signal Classifier',
    tags: 'QUANTUM ML · EEG · SIGNAL PROCESSING',
    status: 'In Development',
    image: '/projects/Qeez.jpg',
    overview: 'A hybrid quantum-classical machine learning pipeline designed for biomedical EEG signal classification. It processes raw neural inputs and maps classical data to quantum states for high-dimensional feature analysis.',
    features: [
      'Raw EEG preprocessing via MNE-Python (0.5–40 Hz band-pass filtering, epoch segmentation)',
      'Advanced feature extraction using wavelet transform, Shannon entropy, and Power Spectral Density',
      'Quantum variational circuit design (VQC) using Qiskit with feature map customization',
      'Comparative benchmarking against classical SVM and Random Forest models'
    ],
    challenges: 'Mapping high-dimensional classical EEG features onto a limited number of qubits (quantum states) without losing critical data variance, and mitigating quantum noise during simulation.',
    learned: 'Acquired a strong foundation in Quantum Information Theory, learned to construct variational circuits in Qiskit, and optimized time-series feature selection for quantum kernels.',
    github: null,
    liveDemo: null
  },
  {
    index: '03',
    title: 'Packet Analyzer',
    tags: 'CYBERSECURITY · NETWORKING · TRAFFIC ANALYSIS',
    status: 'Completed',
    image: '/projects/dpi.jpg',
    overview: 'A deep packet inspection (DPI) security engine designed to intercept and parse network traffic payloads, applying signature-based and heuristic analysis to identify threat anomalies in real-time.',
    features: [
      'Raw packet capturing and layer-by-layer protocol dissection across TCP/IP stack',
      'Custom scanning engine using regex and Aho-Corasick algorithms for signature matching',
      'Heuristic anomaly detection (unusual connection rates, malformed packet payloads)',
      'Dynamic network connection graph visualizations highlighting traffic spikes'
    ],
    challenges: 'Developing highly optimized, multi-threaded buffers to analyze high-throughput packet streams without dropping packets or exhausting local system memory.',
    learned: 'Deepened my understanding of low-level networking, threat signature design, packet capturing libraries, and concurrent programming in Python.',
    github: null,
    liveDemo: null
  },
  {
    index: '04',
    title: 'Red Team Automation Platform',
    tags: 'CYBERSECURITY · AUTOMATION · RECON',
    status: 'In Progress',
    image: '/projects/RedTeam.jpg',
    overview: 'A security automation platform engineered for authorized reconnaissance, active network scanning, service enumeration, vulnerability assessment, and centralized security posture reporting.',
    features: [
      'Automated multi-stage reconnaissance workflows integrating Nmap and custom script engines',
      'Target network asset discovery, open port detection, and live service fingerprinting',
      'Vulnerability scanning and risk scoring pipeline with modular assessment plugins',
      'Interactive centralized web dashboard built with Python and Flask for real-time reporting'
    ],
    challenges: 'Coordinating high-concurrency network tasks without triggering rate limits or false positives, and cleanly normalizing varied scan outputs into structured vulnerability schemas.',
    learned: 'Gained advanced expertise in offensive security methodologies, network scanning internals, asynchronous task orchestration, and modular security dashboard architecture.',
    github: null,
    liveDemo: null
  },
  {
    index: '05',
    title: 'Portfolio',
    tags: 'CREATIVE DEV · WEBGL · THREE.JS',
    status: 'Completed',
    image: '/projects/portfolio.png',
    overview: 'This website! A premium, high-performance creative portfolio featuring a 3D particle simulation, custom physics engine, and a fluid page-less timeline driven by scroll.',
    features: [
      'Custom Three.js particle system with 14,000 particles morphing between 7 unique structures',
      'Single WebGL renderer, scene, and animation loop integrated with GSAP-controlled timeline',
      'Dynamic post-processing pipeline featuring custom transition wipes, bloom, and lensing distortion',
      'Desktop pointer parallax and glassmorphic UI overlay with ambient glow'
    ],
    challenges: 'Optimizing CPU particle physics for 14,000 particles to run at a solid 60fps on mobile devices and coordinating complex DOM transitions with WebGL rendering.',
    learned: 'Mastered GLSL shaders, camera rig interpolation math, performance profiling for 3D web applications, and premium interactive design principles.',
    github: 'https://github.com/syedaakifzain',
    liveDemo: 'https://syedaakifzain.github.io'
  }
]

export class ProjectOverlay {
  constructor() {
    this._overlay = document.getElementById('project-overlay')
    this._inner = document.getElementById('overlay-inner')
    this._closeBtn = document.getElementById('overlay-close')
    this._projectCanvas = null  // set externally for drag-gating

    if (!this._overlay) return

    // Close button
    this._closeBtn?.addEventListener('click', () => this.close())

    // Keyboard: Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._isOpen) this.close()
    })

    // Click outside inner content to close
    this._overlay.addEventListener('click', (e) => {
      if (e.target === this._overlay) this.close()
    })

    // Project cards → open overlay (with drag-gating)
    document.querySelectorAll('.project-card[data-project]').forEach((card) => {
      card.addEventListener('click', () => {
        // If ProjectCanvas indicates a drag just happened, suppress the click
        if (this._projectCanvas && this._projectCanvas.wasDragging()) return
        const idx = parseInt(card.dataset.project, 10)
        if (!isNaN(idx)) this.open(idx)
      })
      // Keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          const idx = parseInt(card.dataset.project, 10)
          if (!isNaN(idx)) this.open(idx)
        }
      })
    })

    this._isOpen = false
  }

  /** Set the ProjectCanvas instance for drag-gating */
  setProjectCanvas(pc) {
    this._projectCanvas = pc
  }

  open(projectIndex) {
    const data = PROJECT_DATA[projectIndex]
    if (!data || !this._overlay || !this._inner) return

    this._inner.innerHTML = this._buildHTML(data)
    this._overlay.removeAttribute('hidden')
    this._overlay.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'

    // Focus the close button
    this._closeBtn?.focus()

    this._isOpen = true
  }

  close() {
    if (!this._overlay) return
    this._overlay.setAttribute('hidden', '')
    this._overlay.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
    this._isOpen = false
  }

  _buildHTML(data) {
    const statusHTML = data.status
      ? `<span class="detail-status detail-status--${data.status.toLowerCase().replace(/\s+/g, '-')}" aria-label="Project Status: ${data.status}">${data.status}</span>`
      : '';

    const tagsHTML = data.tags
      .split(' · ')
      .map(tag => `<span class="detail-tag">${tag}</span>`)
      .join('');

    const featuresHTML = data.features
      .map(f => `<li>${f}</li>`)
      .join('');

    const githubBtn = data.github
      ? `<a href="${data.github}" class="detail-btn detail-btn--github" target="_blank" rel="noopener noreferrer">
           <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
           GitHub
         </a>`
      : `<span class="detail-btn detail-btn--disabled" title="Repository is private">
           <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
           Source Private
         </span>`;

    const demoBtn = data.liveDemo
      ? `<a href="${data.liveDemo}" class="detail-btn detail-btn--demo" target="_blank" rel="noopener noreferrer">
           <svg class="btn-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
           Live Demo
         </a>`
      : '';

    return `
      <div class="detail-layout">
        <div class="detail-visual">
          <img src="${data.image}" alt="${data.title} cinematic hero render" class="detail-image" />
          <div class="detail-image-glow" style="background-image: url(${data.image})"></div>
        </div>
        <div class="detail-info">
          <div class="detail-top-row">
            <span class="detail-num">${data.index}</span>
            ${statusHTML}
          </div>
          <h2 class="detail-title">${data.title}</h2>
          <div class="detail-tags-container">${tagsHTML}</div>
          
          <div class="detail-scroll-area">
            <div class="detail-section">
              <h3 class="detail-section-title">Overview</h3>
              <p class="detail-section-text">${data.overview}</p>
            </div>
            
            <div class="detail-section">
              <h3 class="detail-section-title">Key Features</h3>
              <ul class="detail-features-list">${featuresHTML}</ul>
            </div>
            
            <div class="detail-section">
              <h3 class="detail-section-title">Challenges</h3>
              <p class="detail-section-text">${data.challenges}</p>
            </div>
            
            <div class="detail-section">
              <h3 class="detail-section-title">What I Learned</h3>
              <p class="detail-section-text">${data.learned}</p>
            </div>
          </div>
          
          <div class="detail-footer">
            ${githubBtn}
            ${demoBtn}
          </div>
        </div>
      </div>
    `;
  }
}

