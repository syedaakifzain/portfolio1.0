# SYED AAKIF ZAIN --- PARTICLE CINEMATIC PORTFOLIO

## Production Implementation Plan for AI Review and Implementation

**Document status:** Final creative/technical direction\
**Primary identity:** UI/UX Designer × Creative Technologist\
**Experience type:** Scroll-driven immersive Three.js portfolio\
**Core statement:**\
\> I DESIGN EXPERIENCES.\
\> I CODE THEM INTO REALITY.

------------------------------------------------------------------------

# 0. EXECUTIVE DIRECTIVE TO THE IMPLEMENTING AI

This is not a conventional portfolio and must not be implemented as a
stack of full-screen HTML sections with unrelated animations.

The supplied JavaScript files are **procedural particle simulations**,
not plug-and-play scene components. They are reference implementations
containing mathematical particle-position and color logic. Their visual
algorithms must be extracted, normalized, and integrated into **one
production rendering architecture**.

Do **not** instantiate every exported `ParticlesSwarm` class directly.

Do **not** create eight WebGL renderers.

Do **not** create eight independent `requestAnimationFrame` loops.

Do **not** run 20,000-particle CPU update loops for several simulations
simultaneously.

Do **not** copy the exported files into `src/scenes` and call that
"integration".

The correct approach is:

``` text
SUPPLIED CASBERRY EXPORTS
          ↓
EXTRACT VISUAL EQUATIONS / PARAMETERS
          ↓
NORMALIZE INTO PARTICLE FORMATION MODULES
          ↓
ONE RENDERER + ONE CAMERA + ONE COMPOSER
          ↓
ONE PARTICLE EXPERIENCE CONTROLLER
          ↓
SCROLL-DRIVEN FORMATION / CAMERA / DOM TIMELINE
```

The website must be built and validated chapter by chapter.

------------------------------------------------------------------------

# 1. SOURCE FILE AUDIT

Eight particle simulation exports were supplied:

1.  `blackhole_and_singularity.js`
2.  `backhole_c.js`
3.  `dna_by_glj.js`
4.  `jellyfish_2.js`
5.  `jellyfish.js`
6.  `whirlpool.js`
7.  `bl4ck_hole.js`
8.  `black_hole.js`

All eight exports share a similar wrapper architecture:

-   `THREE.Scene`
-   `THREE.PerspectiveCamera`
-   `THREE.WebGLRenderer`
-   `EffectComposer`
-   `RenderPass`
-   `UnrealBloomPass`
-   `InstancedMesh`
-   `TetrahedronGeometry(0.25)`
-   `MeshBasicMaterial`
-   20,000 default instances
-   CPU-side particle target calculation
-   CPU-side `Vector3.lerp`
-   `setMatrixAt` per particle per frame
-   `setColorAt` per particle per frame
-   independent `requestAnimationFrame`
-   independent renderer/composer lifecycle

## 1.1 Critical source defect

Every supplied export contains the duplicate declaration:

``` js
let THREE_LIB = THREE;
let THREE_LIB = THREE;
```

This is a JavaScript syntax error in the same block scope.

The raw exports must therefore **not be treated as production-ready
modules**.

Remove the duplicate declaration during extraction/refactoring.

## 1.2 Architectural risk

Each source creates its own renderer, camera, composer, bloom pass,
scene, clock, and animation loop.

Instantiating several sources would create:

-   multiple canvases
-   competing render loops
-   duplicated bloom pipelines
-   excessive GPU memory usage
-   excessive CPU work
-   scene overlap
-   lifecycle bugs
-   unpredictable DOM stacking

This is forbidden.

## 1.3 Performance risk

The source pattern updates up to 20,000 instanced matrices and colors in
JavaScript every frame.

At 60 FPS, one simulation conceptually performs up to:

``` text
20,000 particle iterations × 60 frames
= 1,200,000 particle iterations per second
```

This excludes matrix construction, color updates, post-processing, DOM
animation, and other scenes.

Several active simulations would be unacceptable for a production
portfolio.

The implementation must keep only the required formations active and
should strongly consider GPU-based particle position calculation for the
final quality tier.

------------------------------------------------------------------------

# 2. DEEP VISUAL CLASSIFICATION OF THE SUPPLIED SIMULATIONS

## 2.1 `black_hole.js` --- GARGANTUA / CINEMATIC GRAVITY

### Mathematical identity

The simulation separates particles into four conceptual groups:

-   60% accretion disk
-   25% gravitational lensing arcs
-   7% event-horizon shell
-   8% distant spatial particles

Core controls:

``` text
Event Horizon = 10
Disk Radius   = 50
Time Scale    = 0.4
```

### Visual identity

-   warm orange/yellow accretion energy
-   bright inner ring
-   dark singularity
-   curved lensing structures
-   sparse distant particles
-   cinematic and immediately understandable

### Best narrative role

**HERO / IDENTITY**

This is the strongest opening simulation because it has a clear central
focal point and readable silhouette.

------------------------------------------------------------------------

## 2.2 `blackhole_and_singularity.js` --- STRUCTURED ACCRETION

### Mathematical identity

Uses:

-   golden-angle distribution
-   logarithmic spiral
-   radius-dependent rotational speed
-   disk-band modulation
-   gravitational bend
-   heat-based HSL mapping

Parameters:

``` text
scale     = 142.4
spin      = 3.008
accretion = 1.8
warp      = 0
```

### Visual identity

-   broad spiral structure
-   organized particle flow
-   cooler outer color range
-   hotter inner region
-   strong sense of system and order

### Best narrative role

**ABOUT / MULTIDISCIPLINARY IDENTITY**

Narrative concept: many interests, one orbit.

------------------------------------------------------------------------

## 2.3 `backhole_c.js` --- SPACE-TIME / RELATIVISTIC JETS

### Mathematical identity

Uses:

-   radial noise
-   gravity collapse
-   frame-dragging style angular modification
-   lensing scale
-   singularity pull
-   narrow jet mask using a high power
-   photon ring displacement

Parameters:

``` text
gravity = 7.129
swirl   = 3.52
disk    = 54.2
warp    = 3.8
jets    = 3.45
```

### Visual identity

-   energetic
-   blue/cyan-biased
-   vertical jet potential
-   more aggressive spatial distortion
-   wider directional composition

### Best narrative role

**DESIGN PHILOSOPHY / BREAKING DIMENSIONS**

Narrative concept: design is not surface decoration; it changes how
complexity is perceived.

------------------------------------------------------------------------

## 2.4 `bl4ck_hole.js` --- KERR BLACK HOLE / MULTI-SYSTEM COMPLEXITY

### Mathematical identity

This is the most structurally complex supplied simulation.

Particle ranges represent:

-   singularity core
-   photon orbit
-   Keplerian accretion disk
-   lensing arcs
-   polar jets
-   tidal disruption arms
-   Hawking-style radiation shell

Parameters:

``` text
mass = 18
spin = 1.8
turb = 2.2
jet  = 1.4
```

### Visual identity

-   multiple visual systems coexisting
-   orange/red accretion
-   cyan/blue jets
-   high energy
-   broad spatial composition
-   controlled turbulence

### Best narrative role

**SELECTED WORK / PROJECT UNIVERSE**

Each visual system can conceptually support a different project node.

------------------------------------------------------------------------

## 2.5 `whirlpool.js` --- VORTEX + GALLEON

### Mathematical identity

The source is not merely a whirlpool.

It contains:

-   a procedural sea
-   vortex falloff
-   sink depth
-   twist
-   ocean swell
-   a particle-built galleon
-   hull
-   deck
-   sails
-   masts
-   ship orbit around the vortex

Parameters:

``` text
waveSpeed  = 0.8
vortexSize = 16.5
swell      = 1.22
matte      = 0.5
```

### Visual identity

-   narrative scene rather than abstract form
-   clear foreground/subject/background potential
-   circular movement
-   ship under environmental force
-   excellent depth cues

### Best narrative role

**PARALLAX FEATURE CHAPTER / JOURNEY THROUGH WORK**

This scene receives the portfolio's strongest parallax treatment.

------------------------------------------------------------------------

## 2.6 `dna_by_glj.js` --- DOUBLE HELIX

### Mathematical identity

Uses:

-   two helical strands
-   rung particles
-   continuous trigonometric placement
-   500-unit vertical height
-   five twists
-   animated spin

Parameters:

``` text
radius = 30
height = 500
twists = 5
spin   = 1
rungs  = 60
```

### Visual identity

-   extremely tall
-   linear progression
-   structural
-   sequential
-   ideal for vertical camera travel

### Best narrative role

**PROCESS / DESIGN DNA**

The camera should travel along the helix while process steps reveal at
different depths.

------------------------------------------------------------------------

## 2.7 `jellyfish_2.js` --- COMPLEX BIOLUMINESCENT MEDUSA

### Mathematical identity

Four particle regions:

-   bell
-   internal lobes
-   central structures
-   32 tentacle system

Uses:

-   contraction pulse
-   delayed tentacle drift
-   rim ripple
-   bioluminescent pulse
-   swim offset

Parameters:

``` text
scale = 5.34
pulse = 5
glow  = 1
```

### Visual identity

-   organic
-   intelligent
-   highly expressive
-   soft after several aggressive vortex scenes
-   cyan/purple/bioluminescent appearance
-   complex adaptation

### Best narrative role

**SKILLS / ADAPTABILITY / CREATIVE INTELLIGENCE**

This is the primary jellyfish scene.

------------------------------------------------------------------------

## 2.8 `jellyfish.js` --- SIMPLIFIED MEDUSA

### Mathematical identity

Simpler two-region system:

-   cap
-   20 tentacles

Parameters:

``` text
pulse = 2.975
flow  = 8.29
size  = 22.4
```

### Visual identity

-   simpler silhouette
-   calmer
-   less internally complex
-   suitable as a reduced final visual state

### Best narrative role

**CONTACT / FINAL LIVING SIGNATURE**

This should not be treated as a duplicate skills scene.

It becomes the quiet final form.

------------------------------------------------------------------------

# 3. FINAL STORYLINE

The portfolio narrative is:

``` text
GRAVITY
   ↓
ORBIT
   ↓
DISTORT
   ↓
SYSTEMS
   ↓
NAVIGATE
   ↓
STRUCTURE
   ↓
ADAPT
   ↓
CONNECT
```

Human interpretation:

``` text
WHO I AM
   ↓
WHAT I EXPLORE
   ↓
HOW I THINK
   ↓
WHAT I BUILD
   ↓
HOW I MOVE THROUGH COMPLEXITY
   ↓
HOW I WORK
   ↓
WHAT I CAN DO
   ↓
LET'S CREATE
```

This is not a story about space.

The particle systems are visual metaphors for a designer who organizes
complexity and builds interactive systems.

------------------------------------------------------------------------

# 4. FINAL SCENE ORDER

  Chapter   Source formation                 Narrative
  --------- -------------------------------- --------------------------------
  01        `black_hole.js`                  Identity / Hero
  02        `blackhole_and_singularity.js`   About / Orbit of interests
  03        `backhole_c.js`                  Design philosophy / Distortion
  04        `bl4ck_hole.js`                  Selected projects / Systems
  05        `whirlpool.js`                   Parallax journey / Navigation
  06        `dna_by_glj.js`                  Process / Design DNA
  07        `jellyfish_2.js`                 Skills / Adaptability
  08        `jellyfish.js`                   Contact / Living signature

The implementing AI must preserve this order unless a technical
prototype proves a specific transition mathematically impossible.

A technical difficulty is not permission to arbitrarily reorder the
narrative.

------------------------------------------------------------------------

# 5. MASTER SCROLL MAP

Initial production target:

  Scroll progress   Chapter
  ----------------- ------------------
  0.000--0.125      Hero
  0.125--0.235      About
  0.235--0.345      Philosophy
  0.345--0.535      Projects
  0.535--0.665      Parallax Journey
  0.665--0.785      Process
  0.785--0.915      Skills
  0.915--1.000      Contact

Transition windows exist inside these ranges.

Do not use one viewport height per chapter.

Recommended total scroll length for initial desktop prototype:

``` text
900vh–1200vh
```

Tune after interaction testing.

------------------------------------------------------------------------

# 6. CHAPTER 01 --- GRAVITY / HERO

## Formation

`black_hole.js`

## Opening composition

Black screen.

A faint inner ring appears.

Particles gradually resolve into the Gargantua formation.

Do not begin with 20,000 particles randomly scattered across the
viewport.

The first visual impression must be intentional.

## Copy

### Name

> SYED AAKIF ZAIN

### Statement

> I DESIGN. I BUILD. I EXPERIMENT.

### Descriptor

> Creative Developer · UI/UX Designer · AI & Security Explorer

## UI composition

The black hole occupies the right-center or visual center depending on
viewport ratio.

Typography should not cover the brightest particle ring.

Desktop preference:

``` text
LEFT / LOWER-LEFT
SYED AAKIF ZAIN

I DESIGN.
I BUILD.
I EXPERIMENT.

Creative Developer · UI/UX Designer
· AI & Security Explorer
```

The statement may reveal line by line.

## Hero motion

At rest:

-   slow particle simulation time
-   subtle camera breathing
-   tiny pointer parallax
-   black background
-   restrained bloom

Pointer parallax must affect camera target by only a small amount.

Do not make the black hole chase the cursor.

## Scroll behaviour

0.000--0.055:

-   copy enters
-   black hole remains readable
-   camera advances slightly

0.055--0.095:

-   typography separates in depth
-   `I DESIGN.` moves slowest
-   `I BUILD.` moves at medium speed
-   `I EXPERIMENT.` moves fastest
-   this creates a subtle typographic depth effect

0.095--0.125:

-   camera accelerates toward the event horizon
-   descriptor fades
-   name reduces in opacity
-   accretion brightness increases
-   radial lensing transition begins

------------------------------------------------------------------------

# 7. TRANSITION A --- GRAVITATIONAL LENSING TUNNEL

## Hero → About

This transition must be particle-driven.

Do not fade one canvas out and another canvas in.

### Visual sequence

1.  Camera approaches the black-hole center.
2.  Event-horizon ring expands beyond viewport bounds.
3.  DOM typography stretches by approximately 1--3% horizontally and
    blurs.
4.  Chromatic separation appears very briefly at the screen edge.
5.  Particle positions begin interpolating toward the
    `blackhole_and_singularity` formation.
6.  Camera exits the dark center into the broader accretion formation.
7.  Blur resolves.
8.  About copy enters.

### Technical strategy

Use a formation morph progress:

``` text
uFormationMix: 0 → 1
```

Conceptually:

``` js
finalPosition = mix(heroPosition, aboutPosition, easedMix)
```

For CPU prototype:

-   precompute target arrays
-   interpolate positions

For production:

-   use shader attributes or deterministic formation equations
-   interpolate in vertex logic

### Transition style

**Radial lensing + dynamic blur + chromatic edge split**

Use chromatic separation only during the transition.

Do not leave RGB split active as permanent decoration.

------------------------------------------------------------------------

# 8. CHAPTER 02 --- ORBIT / ABOUT

## Formation

`blackhole_and_singularity.js`

## Main copy

> I DON'T STAY IN ONE DIMENSION.

## About copy

> I'm Aakif, a Computer Science and Design Engineering student exploring
> the intersection of design, intelligent systems and immersive digital
> experiences.

## Domain words

-   DESIGN
-   INTERACTION
-   AI
-   WEB
-   3D
-   SECURITY
-   EXPERIMENTATION

`DESIGN` must have the strongest visual hierarchy.

## Interaction

The domain words occupy different visual depth planes.

Use **subtle multi-layer parallax**, but this is not the main parallax
showcase.

Example depth multipliers:

``` text
DESIGN          0.25
INTERACTION     0.35
AI              0.50
WEB             0.55
3D              0.65
SECURITY        0.75
EXPERIMENTATION 0.85
```

These are relative motion factors, not opacity values.

## Visual intent

The particle system represents many interests moving in one coherent
orbit.

Do not display a skill grid here.

------------------------------------------------------------------------

# 9. TRANSITION B --- REFRACTIVE GLASS SLICE

## About → Philosophy

This is the first glass transition.

Do not cover the whole portfolio in permanent glassmorphism.

### Visual sequence

1.  A thin translucent vertical plane enters from the right.
2.  The plane behaves like refractive glass.
3.  Content behind it appears blurred and slightly displaced.
4.  As the plane crosses the screen, particle color and formation change
    behind the glass.
5.  The old formation remains visible on the un-crossed side.
6.  The new `backhole_c` formation appears on the crossed side.
7.  The glass plane bends slightly in response to scroll velocity.
8.  It exits left.
9.  Philosophy typography resolves.

### Preferred implementation

Prototype:

-   DOM glass overlay
-   semi-transparent background
-   `backdrop-filter: blur(...)`
-   subtle border highlight
-   transform based on scroll progress

Production enhancement:

-   WebGL distortion plane with a screen texture
-   displacement/refraction shader
-   scroll velocity drives distortion strength

### Important rule

The glass is a **transition object**, not a generic card style.

Avoid excessive glass cards.

------------------------------------------------------------------------

# 10. CHAPTER 03 --- DISTORT / DESIGN PHILOSOPHY

## Formation

`backhole_c.js`

## Main statement

> CHAOS IS JUST AN UNDESIGNED SYSTEM.

## Supporting copy

> I turn ideas, problems and experiments into digital experiences people
> can understand and interact with.

## Secondary microcopy

> CLARITY IS A DESIGN DECISION.

This line should be small and optional based on visual balance.

## Motion

Use the formation's strong jets and warp behaviour.

The composition may shift off-center.

Text should initially appear slightly fragmented.

As the user scrolls:

-   fragments align
-   letter spacing normalizes
-   blur reduces
-   statement becomes perfectly readable

The interaction itself demonstrates the message:

``` text
CHAOS → ORGANIZATION → CLARITY
```

## Typography effect

Use a controlled split-text reveal.

Do not randomize every character.

Possible sequence:

-   line clip
-   8--16 px vertical offset
-   blur 8 px → 0
-   tracking 0.12em → normal

------------------------------------------------------------------------

# 11. TRANSITION C --- PARTICLE PRESSURE / SYSTEM IGNITION

## Philosophy → Projects

### Visual sequence

1.  Philosophy copy becomes stable.
2.  Scroll pressure increases.
3.  The vertical jets narrow.
4.  Particle energy collapses toward the center.
5.  Screen briefly reaches a high-density central core.
6.  Core emits two directional particle bursts.
7.  The `bl4ck_hole` multi-system formation expands.
8.  Project labels emerge from separate particle regions.

### Transition identity

**Compression → ignition → multi-system expansion**

No glass effect here.

No page wipe.

No fade-to-black unless required for a low-performance fallback.

------------------------------------------------------------------------

# 12. CHAPTER 04 --- SYSTEMS / SELECTED EXPERIMENTS

## Formation

`bl4ck_hole.js`

## Heading

> SELECTED EXPERIMENTS

## Intro line

> DIFFERENT PROBLEMS. DIFFERENT SYSTEMS. ONE OBSESSION: MAKING THEM
> WORK.

## Project mapping

The simulation contains visually distinct particle systems. Use them as
project anchors.

### Accretion disk

**Quantum EEG Signal Classifier**

Tags:

-   QUANTUM AI
-   EEG
-   QML

Narrative emphasis:

Complex biomedical signals transformed into a classification pipeline.

### Polar jet north

**DPI Security Engine**

Tags:

-   CYBERSECURITY
-   NETWORKING
-   TRAFFIC ANALYSIS

Narrative emphasis:

Inspecting network traffic and converting invisible packet behaviour
into actionable detection.

### Polar jet south

**Face Recognition Attendance System**

Tags:

-   COMPUTER VISION
-   AI
-   AUTOMATION

Narrative emphasis:

Replacing manual attendance friction with real-time recognition.

### Lensing arc

**AI Career & Education Advisor**

Tags:

-   AI
-   PRODUCT DESIGN
-   STUDENT EXPERIENCE

Narrative emphasis:

Helping students navigate fragmented education and career information.

### Tidal disruption arm

**VetPro Digital Experience**

Tags:

-   WEB DESIGN
-   UI
-   DIGITAL EXPERIENCE

Narrative emphasis:

Designing a clearer digital presence and interactive web experience.

## Project navigation

The projects must not be five conventional cards.

Scroll selects a project.

At any moment:

-   one project is primary
-   one formation region receives controlled emphasis
-   primary title is fully readable
-   adjacent project labels are visible but subordinate

## Desktop interaction

-   scroll controls project progression
-   pointer hover may reveal `VIEW CASE`
-   click opens project detail overlay

## Mobile interaction

-   vertical project progression
-   tap to focus
-   visible `VIEW PROJECT` action
-   no hover dependency

## Project overlay style

Use **restrained glassmorphism** here.

A project detail overlay may use:

``` text
dark translucent surface
background blur
1 px low-opacity edge
large typography
minimal rounded geometry
```

Do not use colorful glass cards.

The glass must feel optical and cinematic, not like a SaaS dashboard.

------------------------------------------------------------------------

# 13. TRANSITION D --- LIQUID GLASS COLLAPSE

## Projects → Whirlpool

This is the strongest modern glass transition.

### Visual sequence

1.  Active project overlay closes.
2.  A circular refractive lens forms around the active particle region.
3.  Lens expands.
4.  The surrounding scene appears optically compressed.
5.  The lens surface develops liquid displacement.
6.  The black-hole formation bends into circular flow.
7.  Particle positions morph toward the sea/vortex distribution.
8.  The refractive surface becomes the whirlpool surface.
9.  Camera tilts from cosmic orientation to an environmental horizon.

### Implementation note

This should feel like the material itself transforms.

Avoid a literal water splash stock effect.

### Shader concept

Inputs:

``` text
uProgress
uVelocity
uPointer
uTime
```

Effects:

``` text
radial UV distortion
noise displacement
edge Fresnel
blur strength
subtle chromatic dispersion
```

Keep dispersion restrained.

------------------------------------------------------------------------

# 14. CHAPTER 05 --- NAVIGATE / MAIN PARALLAX EXPERIENCE

## Formation

`whirlpool.js`

## Narrative role

This is the dedicated parallax chapter.

The source contains a ship moving around a vortex. Use the metaphor:

> IDEAS DON'T ARRIVE WITH A MAP.

Then:

> I LEARN BY NAVIGATING THE UNKNOWN.

## Why this scene receives parallax

The formation naturally contains:

-   environmental sea plane
-   central vortex
-   ship
-   sails/masts
-   atmospheric depth

This supports true layered spatial movement rather than fake background
parallax.

## Parallax layers

### Layer 0 --- far atmosphere

-   sparse particles
-   slowest movement
-   depth factor: approximately 0.08

### Layer 1 --- ocean field

-   broad sea particles
-   depth factor: approximately 0.20

### Layer 2 --- vortex

-   central whirlpool
-   depth factor: approximately 0.40

### Layer 3 --- ship

-   primary narrative object
-   depth factor: approximately 0.70

### Layer 4 --- typography

-   DOM/WebGL synchronized text
-   depth factor: approximately 0.90--1.10 depending on line

## Scroll choreography

0% of chapter:

-   high camera
-   vortex visible
-   ship small
-   `IDEAS DON'T ARRIVE WITH A MAP.`

30%:

-   camera lowers
-   ship becomes identifiable
-   foreground sea moves faster than distant particles

55%:

-   camera tracks laterally
-   ship crosses composition
-   first text exits in opposite direction to camera

70%:

-   `I LEARN BY NAVIGATING THE UNKNOWN.` enters
-   ship remains readable
-   vortex moves deeper into frame

100%:

-   camera approaches mast/sail geometry
-   vertical structures fill the frame
-   those vertical lines motivate the DNA transition

## Pointer parallax

Desktop only.

Use normalized pointer:

``` text
x: -1 → 1
y: -1 → 1
```

Apply small camera target offsets.

Scroll remains primary.

Pointer movement must not override the scroll camera path.

## Mobile

Disable pointer parallax.

Reduce layer separation.

Keep the ship and vortex readable.

------------------------------------------------------------------------

# 15. TRANSITION E --- KINETIC LINE RECONSTRUCTION

## Whirlpool → DNA

### Visual sequence

1.  Camera approaches ship mast and sail structures.
2.  Particle-built vertical lines dominate frame.
3.  Ocean particles darken.
4.  Vertical ship particles stretch.
5.  Lines twist.
6.  Two principal particle streams emerge.
7.  Streams spiral around each other.
8.  Rung particles connect.
9.  DNA formation resolves.

### Transition identity

**Object deconstruction → line flow → double helix reconstruction**

This transition must be based on particle correspondence where possible.

Do not use glass here.

------------------------------------------------------------------------

# 16. CHAPTER 06 --- STRUCTURE / MY DESIGN DNA

## Formation

`dna_by_glj.js`

## Opening copy

> I DON'T START WITH CODE.

## Process sequence

> 01 --- QUESTION

> 02 --- EXPLORE

> 03 --- DESIGN

> 04 --- BUILD

> 05 --- BREAK

> 06 --- IMPROVE

## Ending

> REPEAT.

## Camera choreography

The DNA source has a 500-unit vertical height.

Use this.

Do not frame the entire DNA helix as a small object for the whole
chapter.

The camera travels along the helix.

Each process stage occupies a conceptual depth checkpoint.

Example:

``` text
QUESTION  → y +200
EXPLORE   → y +120
DESIGN    → y +40
BUILD     → y -40
BREAK     → y -120
IMPROVE   → y -200
```

Exact values depend on normalized source scale.

## Typography

Each process step appears as the camera reaches its checkpoint.

Previous steps become faint but do not immediately disappear.

At the end:

-   camera stops
-   DNA rotation slows
-   all six words become faint
-   `REPEAT.` appears centrally

## Message

The chapter must communicate:

``` text
design thinking + implementation + iteration
```

It must not suggest that Syed avoids coding.

------------------------------------------------------------------------

# 17. TRANSITION F --- CHROMATIC HELIX DISSOLVE

## DNA → Complex Jellyfish

### Visual sequence

1.  `REPEAT.` remains centered.
2.  DNA spin slows.
3.  Helix colors desaturate.
4.  Rung connections detach.
5.  Strand particles become free-flowing.
6.  Two strands bend into a circular bell outline.
7.  Remaining particles trail downward.
8.  Cyan/purple color gradually returns.
9.  Bioluminescent pulse activates.
10. Jellyfish resolves.
11. `REPEAT.` dissolves on the first jellyfish pulse.

### Transition style

**Particle dissolve + chromatic reassembly**

A brief bloom pulse may hide minor formation mismatch.

Do not white-flash the entire screen.

------------------------------------------------------------------------

# 18. CHAPTER 07 --- ADAPT / SKILLS

## Formation

`jellyfish_2.js`

## Main statement

> I DESIGN EXPERIENCES.

## Secondary statement

> I CODE THEM INTO REALITY.

These lines are locked.

Do not replace `CODE` with `BUILD`.

Do not reintroduce the word `SOMETIMES`.

## Skill hierarchy

### Primary --- DESIGN

-   Figma
-   UI/UX Design
-   Interaction Design
-   Responsive Design
-   Human-Computer Interaction

### Creative design

-   Spline
-   3D Web Design
-   Visual Storytelling
-   Prototyping
-   Design Systems

### Development

-   HTML
-   CSS
-   Python
-   Java
-   Streamlit

### AI & intelligence

-   Machine Learning
-   Generative AI
-   Computer Vision
-   Quantum ML

### Security & tools

-   Kali Linux
-   Burp Suite
-   Nmap
-   Wireshark
-   Git & GitHub

## Skill interaction

The jellyfish has four conceptual particle regions.

Map capability groups to regions.

### Bell

DESIGN

This receives strongest typography and longest dwell time.

### Internal lobes/core

CREATIVE DESIGN

### Central trailing structures

DEVELOPMENT

### Tentacles

AI & INTELLIGENCE / SECURITY & TOOLS

The metaphor is:

``` text
DESIGN is the body.
TECHNOLOGY extends the reach.
```

## Reveal choreography

Jellyfish pulse 1:

> I DESIGN EXPERIENCES.

Jellyfish pulse 2:

Design capabilities appear.

Jellyfish pulse 3:

> I CODE THEM INTO REALITY.

Jellyfish pulse 4:

Development capabilities appear.

Later scroll:

AI and security capabilities flow along tentacle paths.

## Forbidden UI

-   skill percentages
-   progress bars
-   radar charts
-   giant logo cloud
-   25 equal cards

------------------------------------------------------------------------

# 19. TRANSITION G --- SOFT BIO-LIQUID SIMPLIFICATION

## Skills → Contact

The complex `jellyfish_2` formation transitions into the simpler
`jellyfish` formation.

This is a deliberate simplification.

### Visual sequence

1.  Skill words drift away.
2.  Complex internal jellyfish particles reduce in brightness.
3.  Tentacle count visually simplifies.
4.  Camera slowly pulls back.
5.  Formation morphs to the simpler medusa.
6.  Bloom decreases.
7.  Background becomes nearly black.
8.  Contact copy appears.

### Transition identity

**Complexity → calm**

No glitch.

No violent distortion.

No aggressive camera movement.

The ending should feel confident.

------------------------------------------------------------------------

# 20. CHAPTER 08 --- CONNECT / CONTACT

## Formation

`jellyfish.js`

## Main copy

> HAVE AN IDEA?

Then:

> LET'S MAKE IT EXIST.

## Primary CTA

> START A CONVERSATION

## Secondary actions

-   LINKEDIN
-   GITHUB

## Footer

> © 2026 SYED AAKIF ZAIN

> DESIGNED & BUILT WITH CURIOSITY.

## Motion

The simplified jellyfish continues a slow pulse.

CTA hover may create a localized particle attraction response.

Do not alter the whole jellyfish on button hover.

## Final interaction

On primary CTA hover:

-   100--300 nearby decorative particles may subtly move toward the CTA
    region
-   button border brightness increases
-   text tracking tightens slightly

On focus:

-   clear keyboard focus state
-   no pointer-only feedback

------------------------------------------------------------------------

# 21. TREND SYSTEM --- USE MODERN EFFECTS WITH DISCIPLINE

The portfolio should use current immersive design patterns, but not
become a trend collage.

Use:

-   immersive 3D
-   motion-led storytelling
-   bold kinetic typography
-   controlled parallax
-   refractive/translucent surfaces
-   dynamic blur
-   scroll-driven shader progress
-   optical distortion
-   particle morphing
-   dark cinematic composition

Do not use every trend in every chapter.

## Effect allocation

  Effect                         Where
  ------------------------------ -----------------------
  Gravitational lensing          Hero transition
  Typographic depth              Hero
  Subtle parallax                About
  Refractive glass slice         About → Philosophy
  Clarity typography             Philosophy
  Particle compression burst     Philosophy → Projects
  Glass project overlay          Projects
  Liquid glass collapse          Projects → Whirlpool
  Strong spatial parallax        Whirlpool
  Particle line reconstruction   Whirlpool → DNA
  Vertical camera journey        DNA
  Chromatic particle dissolve    DNA → Jellyfish
  Bioluminescent pulse sync      Skills
  Soft morph                     Skills → Contact

------------------------------------------------------------------------

# 22. PRODUCTION THREE.JS ARCHITECTURE

Recommended project structure:

``` text
src/
├── main.js
├── app/
│   ├── Experience.js
│   ├── Renderer.js
│   ├── CameraRig.js
│   ├── PostFX.js
│   ├── QualityManager.js
│   └── ResizeManager.js
├── particles/
│   ├── ParticleSystem.js
│   ├── FormationController.js
│   ├── FormationRegistry.js
│   └── formations/
│       ├── gargantua.js
│       ├── accretion.js
│       ├── spacetime.js
│       ├── kerr.js
│       ├── whirlpool.js
│       ├── dna.js
│       ├── medusaComplex.js
│       └── medusaSimple.js
├── timeline/
│   ├── ScrollDirector.js
│   ├── ChapterMap.js
│   ├── TransitionDirector.js
│   └── VelocityTracker.js
├── ui/
│   ├── SceneDOM.js
│   ├── SplitTextController.js
│   ├── ProjectOverlay.js
│   ├── Navigation.js
│   └── ContactUI.js
├── shaders/
│   ├── particles.vert.glsl
│   ├── particles.frag.glsl
│   ├── refraction.vert.glsl
│   └── refraction.frag.glsl
└── styles/
    ├── global.css
    ├── typography.css
    ├── scenes.css
    └── responsive.css
```

------------------------------------------------------------------------

# 23. SINGLE RENDERING PIPELINE

Required:

``` text
ONE WebGLRenderer
ONE primary Scene
ONE CameraRig
ONE EffectComposer
ONE requestAnimationFrame loop
```

Conceptual loop:

``` js
function tick() {
  const delta = clock.getDelta()
  const elapsed = clock.elapsedTime

  scrollDirector.update(delta)
  cameraRig.update(delta)
  formationController.update(delta, elapsed)
  transitionDirector.update(delta)
  uiDirector.update(delta)

  composer.render()
  requestAnimationFrame(tick)
}
```

Do not allow formation modules to call `requestAnimationFrame`.

Do not allow formation modules to create renderers.

Do not allow formation modules to append canvases.

------------------------------------------------------------------------

# 24. FORMATION MODULE CONTRACT

Each extracted source algorithm must become a pure formation module.

Conceptual contract:

``` js
export const gargantuaFormation = {
  id: "gargantua",

  defaults: {
    radius: 10,
    maxRadius: 50,
    speed: 0.4
  },

  getPosition(index, count, time, params, out) {
    // extracted mathematical logic
    return out
  },

  getColor(index, count, time, params, outColor) {
    // extracted color logic
    return outColor
  }
}
```

Formation modules must not own:

-   renderer
-   scene
-   camera
-   composer
-   clock
-   RAF
-   DOM

------------------------------------------------------------------------

# 25. PARTICLE MORPH STRATEGY

## Prototype mode

Use typed arrays.

``` text
currentPositions
sourcePositions
targetPositions
currentColors
sourceColors
targetColors
```

Avoid arrays of 20,000 `THREE.Vector3` objects if possible.

Prefer:

``` js
Float32Array(count * 3)
```

Morph:

``` text
current = source + (target - source) × easedProgress
```

## Production mode

Prefer GPU interpolation.

Possible vertex attributes:

``` text
aPositionFrom
aPositionTo
aColorFrom
aColorTo
```

Uniform:

``` text
uMorphProgress
```

Vertex logic:

``` text
position = mix(aPositionFrom, aPositionTo, easedProgress)
```

For dynamic procedural formations, evaluate deterministic equations in
shader code where practical.

## Critical constraint

Do not morph using random particle reordering every transition.

Particle correspondence must be stable to avoid visual noise.

------------------------------------------------------------------------

# 26. PARTICLE GEOMETRY DECISION

The supplied exports use:

``` js
TetrahedronGeometry(0.25)
```

for 20,000 instances.

This explains the triangular visual language.

The previous failed visual may have exposed the tetrahedral instances
too strongly.

## Recommendation

Do not automatically preserve tetrahedrons for every scene.

Test:

### Hero / black holes

-   `THREE.Points`
-   circular point sprite
-   soft particle shader

### Whirlpool ship

Instanced tetrahedrons or small geometry may preserve the
constructed-object aesthetic.

### DNA

Points or tiny instanced geometry.

### Jellyfish

Soft points with additive or alpha-blended shader.

## Visual rule

Particle primitive is scene-dependent.

The user supplied the simulation behaviour, not a requirement that every
particle must remain a green tetrahedron.

------------------------------------------------------------------------

# 27. COLOR MANAGEMENT

The original files initialize particles as:

``` text
0x00ff88
```

but later calculate scene-specific colors.

Do not expose the initialization green before the first target update.

This can cause a green flash or green-triangle frame.

Required:

-   initialize position/color buffers to the first evaluated formation
    state before first render
-   do not render until initial particle matrices/buffers are valid
-   avoid random initial positions unless the narrative explicitly
    requires a particle assembly

Use scene-calculated HSL/RGB color logic.

------------------------------------------------------------------------

# 28. BLOOM AND POST-PROCESSING

The supplied sources apply:

``` text
UnrealBloomPass strength = 1.8
radius = 0.4
threshold = 0
```

to every scene.

Do not preserve this globally without testing.

A threshold of zero can make nearly all bright content contribute to
bloom.

## Chapter-specific bloom targets

Hero:

``` text
medium-high
```

About:

``` text
medium
```

Philosophy:

``` text
medium-high during jets
```

Projects:

``` text
selective / controlled
```

Whirlpool:

``` text
low
```

DNA:

``` text
medium
```

Skills:

``` text
medium-high bioluminescence
```

Contact:

``` text
low-medium
```

Bloom parameters should interpolate with chapter progress.

Avoid permanent overexposure.

------------------------------------------------------------------------

# 29. SCROLL ARCHITECTURE

Use GSAP ScrollTrigger as the high-level scroll timeline controller.

The WebGL state should consume normalized progress.

Concept:

``` text
ScrollTrigger progress
        ↓
ScrollDirector.targetProgress
        ↓
dampedProgress
        ↓
ChapterMap.resolve(progress)
        ↓
camera / formation / DOM / transition state
```

## Important

Do not create one independent pinned ScrollTrigger per DOM scene if they
compete for the same viewport.

Prefer one master pinned experience and a coordinated timeline.

## Scroll velocity

Track velocity.

Use it carefully for:

-   glass distortion
-   blur strength
-   particle turbulence
-   transition energy

Clamp velocity input.

Do not let fast trackpad scrolling explode shader values.

------------------------------------------------------------------------

# 30. DOM SCENE VISIBILITY CONTRACT

The previous implementation failed because unrelated content appeared
together.

Every chapter DOM root requires explicit lifecycle control.

States:

``` text
INACTIVE
ENTERING
ACTIVE
EXITING
```

Inactive:

``` css
opacity: 0;
visibility: hidden;
pointer-events: none;
```

Active:

``` css
visibility: visible;
```

Interactive pointer events are enabled only where needed.

At scroll progress `0.000`, only Hero narrative content may be visible.

At scroll progress `0.950`, Hero content must not be visible.

No accidental global fixed-text overlap is acceptable.

------------------------------------------------------------------------

# 31. GLASSMORPHISM RULES

Glassmorphism is not the portfolio's base UI style.

Use glass only for:

1.  About → Philosophy refractive transition.
2.  Project detail overlay.
3.  Projects → Whirlpool liquid-glass transition.

## Glass visual specification

Preferred:

``` text
background: low-opacity neutral black/white tint
backdrop blur: controlled
border: 1 px low-opacity highlight
inner highlight: subtle
shadow: minimal
```

Avoid:

-   rainbow glass
-   large glowing cyan borders
-   every button becoming glass
-   every text block in a rounded rectangle

The 3D simulations are the hero.

Glass supports transitions and information hierarchy.

------------------------------------------------------------------------

# 32. TYPOGRAPHY SYSTEM

Use one strong neo-grotesk/grotesk family.

Typography is part of the motion system.

## Display style

-   uppercase
-   high scale
-   tight but readable tracking
-   responsive `clamp()`

## Body

-   readable width
-   restrained size
-   high contrast
-   no center-aligned paragraph walls

## Motion types

Use only a controlled set:

-   line clip reveal
-   blur-to-focus
-   tracking compression
-   depth parallax
-   directional mask
-   split-line exit

Avoid random character scrambling throughout the site.

One small data/glitch moment is acceptable only if narratively
justified.

------------------------------------------------------------------------

# 33. RESPONSIVE STRATEGY

Desktop is the full cinematic version.

Mobile is a deliberately reduced version.

## Desktop

Particle target:

``` text
12,000–20,000 depending on quality tier
```

## Tablet

``` text
8,000–12,000
```

## Mobile

``` text
4,000–8,000
```

Actual values must be benchmarked.

## Mobile reductions

-   no pointer parallax
-   reduced bloom
-   reduced refractive distortion samples
-   shorter camera paths
-   fewer simultaneous skill labels
-   simplified project overlay
-   reduced particle count
-   no excessive chromatic separation

Do not simply scale desktop CSS to 390 px.

------------------------------------------------------------------------

# 34. ADAPTIVE QUALITY

Implement:

``` text
HIGH
MEDIUM
LOW
REDUCED_MOTION
```

Inputs may include:

-   viewport size
-   device pixel ratio
-   device memory when available
-   measured frame time

The runtime should sample performance during the opening experience.

If sustained frame time is poor, lower quality once.

Do not continuously oscillate quality tiers.

Possible reductions:

1.  DPR
2.  particle count
3.  bloom resolution/strength
4.  distortion complexity
5.  background particles

------------------------------------------------------------------------

# 35. ACCESSIBILITY

Meaningful portfolio text must exist in the DOM.

Do not render essential copy only as WebGL textures.

Required:

-   keyboard-accessible project actions
-   keyboard-accessible LinkedIn/GitHub/contact
-   visible focus states
-   semantic headings
-   sufficient contrast
-   `prefers-reduced-motion`
-   usable content if WebGL fails

## Reduced-motion experience

Use:

-   static or very slow particle formations
-   short opacity transitions
-   no event-horizon camera dive
-   no aggressive lensing
-   no strong parallax
-   all content preserved

------------------------------------------------------------------------

# 36. IMPLEMENTATION PHASES

## PHASE 0 --- SOURCE SANITIZATION

Tasks:

-   copy supplied source files into a reference-only directory
-   do not import them into production runtime
-   identify duplicate `THREE_LIB` declarations
-   extract parameters
-   extract position equations
-   extract color equations
-   document particle region percentages

Deliverable:

`SOURCE_AUDIT.md`

Approval required before Phase 1.

------------------------------------------------------------------------

## PHASE 1 --- PARTICLE LAB

Build a developer-only route:

``` text
/lab
```

Features:

-   one renderer
-   one camera
-   one composer
-   formation selector
-   particle count selector
-   bloom controls
-   camera distance control
-   formation parameter controls

Integrate all eight formations individually.

No portfolio text.

No scroll story.

Deliverable:

All eight formations render correctly one at a time.

Approval required.

------------------------------------------------------------------------

## PHASE 2 --- FORMATION MORPH PROTOTYPE

Test only:

``` text
black_hole
        ↓
blackhole_and_singularity
```

Implement stable particle morph.

Validate:

-   no green frame
-   no random particle explosion
-   no second canvas
-   no memory growth
-   smooth reverse scroll

Deliverable:

Two-formation reversible morph.

Approval required.

------------------------------------------------------------------------

## PHASE 3 --- HERO

Implement only Chapter 01.

Validate at:

``` text
progress 0.000
progress 0.040
progress 0.080
progress 0.120
```

Capture screenshots.

No Contact DOM may be mounted visibly.

Deliverable:

Production-quality Hero.

Approval required.

------------------------------------------------------------------------

## PHASE 4 --- HERO TO ABOUT

Implement gravitational lensing transition.

Add Chapter 02.

Validate forward and reverse scroll.

Deliverable:

Hero → About.

Approval required.

------------------------------------------------------------------------

## PHASE 5 --- PHILOSOPHY + REFRACTIVE GLASS

Implement:

-   glass slice transition
-   `backhole_c`
-   clarity typography

Validate glass performance separately on mobile.

Deliverable:

Chapters 01--03.

Approval required.

------------------------------------------------------------------------

## PHASE 6 --- PROJECT SYSTEM

Implement `bl4ck_hole`.

Map project anchors.

Implement one project first:

``` text
Quantum EEG Signal Classifier
```

Validate selection and overlay.

Then add remaining projects.

Deliverable:

Complete project chapter.

Approval required.

------------------------------------------------------------------------

## PHASE 7 --- LIQUID GLASS + WHIRLPOOL

Implement transition.

Implement whirlpool scene.

Do not implement parallax until the base formation renders correctly.

Deliverable:

Static camera whirlpool scene.

Approval required.

------------------------------------------------------------------------

## PHASE 8 --- PARALLAX CHAPTER

Add layered camera/subject parallax.

Validate:

-   scroll motion
-   pointer motion
-   text readability
-   ship visibility
-   mobile fallback

Deliverable:

Main parallax experience.

Approval required.

------------------------------------------------------------------------

## PHASE 9 --- DNA PROCESS

Implement kinetic line reconstruction.

Implement DNA camera journey.

Implement six process checkpoints.

Deliverable:

Process chapter.

Approval required.

------------------------------------------------------------------------

## PHASE 10 --- JELLYFISH SKILLS

Implement complex medusa.

Synchronize copy with pulse rhythm.

Implement skill hierarchy.

Deliverable:

Skills chapter.

Approval required.

------------------------------------------------------------------------

## PHASE 11 --- CONTACT

Morph complex jellyfish into simple jellyfish.

Implement contact UI.

Deliverable:

Complete narrative.

------------------------------------------------------------------------

## PHASE 12 --- PERFORMANCE

Profile:

-   FPS
-   main-thread time
-   draw calls
-   GPU memory indicators where available
-   particle update cost
-   post-processing cost
-   layout shifts

Optimize.

------------------------------------------------------------------------

## PHASE 13 --- ACCESSIBILITY / QA

Test:

-   reduced motion
-   keyboard
-   mobile
-   resize
-   orientation change
-   background tab
-   reverse scroll
-   rapid scroll
-   WebGL context loss strategy
-   slow initial load

------------------------------------------------------------------------

# 37. AI VALIDATION CONTRACT

The implementing AI must not claim a phase is complete based only on
code compilation.

For every visual phase, verify observable states.

Example Hero contract:

``` text
GIVEN progress = 0.000
THEN black_hole formation is visible
AND Hero name is visible
AND Hero statement is visible
AND descriptor is visible
AND Contact CTA is hidden
AND Project labels are hidden
AND Skills are hidden
```

Example Contact contract:

``` text
GIVEN progress >= 0.950
THEN Contact content is visible
AND Hero content is hidden
AND Project overlay is closed
AND simplified jellyfish is active
```

Build similar contracts for every chapter.

Visual quality is not proof of state correctness.

------------------------------------------------------------------------

# 38. STRICT AI RULES

1.  Do not directly instantiate the supplied `ParticlesSwarm` classes in
    production.
2.  Do not create multiple renderers.
3.  Do not create multiple RAF loops.
4.  Do not preserve duplicate `THREE_LIB` declarations.
5.  Do not render the initial green particle state.
6.  Do not show all DOM chapters simultaneously.
7.  Do not add React unless a concrete requirement is documented.
8.  Do not replace the storyline with generic About/Skills cards.
9.  Do not use skill percentages.
10. Do not list Three.js, GSAP, React, or WebGL as Syed's existing
    skills solely because this portfolio uses them.
11. Do not overuse glassmorphism.
12. Do not use a fade transition for every scene.
13. Do not add random neon cyberpunk UI.
14. Do not make every particle a bright green tetrahedron.
15. Do not implement all chapters in one AI coding pass.
16. Do not continue after a failed visual checkpoint.
17. Preserve the exact Hero descriptor unless the user changes it.
18. Preserve:
    -   `I DESIGN EXPERIENCES.`
    -   `I CODE THEM INTO REALITY.`
19. UI/UX must remain the dominant professional identity.
20. The website itself must act as evidence of interaction design
    ability.

------------------------------------------------------------------------

# 39. REVIEW CHECKLIST

## Source integration

-   Were the source equations extracted rather than blindly imported?
-   Is the duplicate declaration defect removed?
-   Is there one renderer?
-   Is there one animation loop?
-   Is initial green state prevented?

## Story

-   Does the sequence feel intentional?
-   Does every particle formation have a narrative role?
-   Are transitions visually different but stylistically coherent?

## UI/UX positioning

-   Is design the strongest identity?
-   Is coding ability still clearly communicated?
-   Are AI and cybersecurity supporting capabilities?

## Motion

-   Is scroll the primary narrative input?
-   Is parallax concentrated in the whirlpool chapter?
-   Does pointer movement remain subtle?
-   Are glass effects limited?
-   Can transitions reverse cleanly?

## Projects

-   Are projects mapped to distinct particle regions?
-   Is one project dominant at a time?
-   Are case studies framed through problem, design decision,
    implementation, and result?

## Performance

-   Is particle count adaptive?
-   Is DPR capped?
-   Is bloom chapter-aware?
-   Are inactive systems computationally inactive?
-   Has mobile been benchmarked?

## Accessibility

-   Is essential text in the DOM?
-   Is reduced motion supported?
-   Are project and contact actions keyboard accessible?
-   Are focus states visible?

------------------------------------------------------------------------

# 40. DEFINITION OF DONE

The portfolio is done only when:

-   all eight supplied particle algorithms are represented in the
    intended sequence
-   no raw Casberry export owns a production renderer
-   one rendering pipeline controls the experience
-   Hero opens with the cinematic Gargantua formation
-   no green initialization frame appears
-   no unrelated DOM scenes overlap
-   particle transitions are reversible
-   the About transition uses refractive glass
-   the Projects transition uses liquid-glass distortion
-   the Whirlpool chapter contains the primary spatial parallax
    experience
-   the DNA chapter creates a vertical process journey
-   the complex jellyfish communicates UI/UX-first skills
-   the simple jellyfish supports the final contact scene
-   `I DESIGN EXPERIENCES. I CODE THEM INTO REALITY.` is implemented
    exactly
-   mobile has a deliberate reduced experience
-   reduced-motion mode preserves all content
-   the production build is profiled and tested

------------------------------------------------------------------------

# FINAL CREATIVE PRINCIPLE

The particles are not decoration.

The black hole is gravity.\
The orbit is curiosity.\
The distortion is design thinking.\
The Kerr system is the body of work.\
The ship is navigation through uncertainty.\
The DNA is process.\
The jellyfish is adaptation.\
The final pulse is connection.

The visitor should finish the portfolio with one clear thought:

> THIS PERSON DOES NOT JUST PLACE UI ON A SCREEN.\
> HE THINKS IN EXPERIENCES --- AND CAN BUILD THEM.
