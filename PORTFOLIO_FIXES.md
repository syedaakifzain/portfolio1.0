# Portfolio Polish & Transition Upgrade Specification

## Purpose

This document defines the required corrections and visual upgrades for
the existing portfolio implementation.

The current project must be treated as an **existing working
portfolio**.

**Do not rebuild the project from scratch.**

The Whirlpool / NAVIGATE chapter was intentionally removed because it
had no portfolio content. The portfolio must remain a **7-chapter
experience** with the current `01 / 07` chapter count.

------------------------------------------------------------------------

# 1. Transition Upgrade

The current shared particle morphing system and single-renderer
architecture must be preserved.

Upgrade the visual transitions between the existing chapters so they
feel cinematic and visually distinct rather than relying mainly on
particle interpolation, camera movement, and text fades.

## Required Transition Mapping

### GRAVITY → ORBIT

**Effect: Gravitational Lensing Tunnel**

Create a brief center-weighted radial distortion or gravitational
lensing impression as the Gargantua formation transitions into the
accretion structure.

The effect should:

-   visually pull or bend the scene toward a focal region
-   create a tunnel-like gravitational impression
-   remain brief and cinematic
-   resolve smoothly into the ORBIT chapter

------------------------------------------------------------------------

### ORBIT → DISTORT

**Effect: Refractive Glass Slice**

Introduce a moving transparent or refractive slice/distortion band that
visually bends the rendered scene during the transition.

The effect should:

-   move across the viewport
-   distort or refract the visible particle scene
-   feel like a glass layer passing through the environment
-   avoid looking like a simple CSS wipe

------------------------------------------------------------------------

### DISTORT → SYSTEMS

**Effect: Particle Pressure / Compression**

Compress particles toward a constrained region.

The transition should:

1.  increase visual particle density
2.  create a sense of pressure or tension
3.  briefly hold the compressed state if visually appropriate
4.  release the particles into the next formation

The effect must remain integrated with the shared particle system.

------------------------------------------------------------------------

### SYSTEMS → STRUCTURE

**Effect: Liquid Glass Collapse**

Create a smooth glass-like collapsing or distortion effect before the
DNA structure resolves.

The transition should feel fluid and refractive.

Avoid implementing this as a basic opacity fade.

------------------------------------------------------------------------

### STRUCTURE → ADAPT

**Effect: Kinetic Line Reconstruction**

The DNA structure should visually break into directional particle or
line movement.

The particles should then reconstruct into the Medusa formation.

The transition should communicate:

`STRUCTURE → BREAKDOWN → DIRECTIONAL MOTION → RECONSTRUCTION → ADAPT`

------------------------------------------------------------------------

### ADAPT → CONNECT

**Effect: Bioluminescent Dissolve**

Allow the Medusa formation to softly dissolve with organic glow
behaviour.

The dissolve should:

-   feel biological and organic
-   use restrained glow behaviour
-   gradually reduce structural definition
-   resolve naturally into the final CONNECT chapter

Avoid a basic fade-to-black transition.

------------------------------------------------------------------------

## Transition Architecture Rules

Where technically appropriate, integrate the effects into the existing:

-   `TransitionDirector`
-   `FormationController`
-   shared particle system
-   existing post-processing pipeline

Do not create:

-   additional WebGL renderers
-   independent Three.js scenes for every chapter
-   additional animation loops
-   additional canvases

The project must continue using:

-   one `WebGLRenderer`
-   one primary scene
-   one camera
-   one `EffectComposer`
-   one `requestAnimationFrame` loop

Transitions must be performant and compatible with the existing
quality-tier system.

------------------------------------------------------------------------

# 2. Subtle Global Pointer Parallax

Add subtle desktop pointer-based depth parallax to make the experience
feel spatial.

The effect must be **restrained, smooth, and cinematic**.

Nothing should directly chase the cursor.

Use smooth interpolation or damping.

## Conceptual Depth Strengths

Where technically applicable, use different pointer influence for
different visual layers:

  Visual Layer                       Approximate Influence
  -------------------------------- -----------------------
  Background / ambient particles                      0.05
  Main formation                                      0.15
  Atmospheric / glow effects                          0.25
  Glass / UI decorative layers                        0.35

These values represent conceptual depth strengths.

They are **not mandatory literal multiplication values**.

The implementation should prioritize visual quality and smoothness.

## Parallax Requirements

-   Desktop pointer input only where appropriate
-   Smooth interpolation or damping
-   No direct cursor chasing
-   No extreme camera rotation
-   No readability loss
-   Reduce or disable on touch/mobile devices
-   Respect `prefers-reduced-motion`
-   Avoid unnecessary per-frame allocations

------------------------------------------------------------------------

# 3. Portfolio Content Accuracy

Audit all project descriptions, technology labels, algorithms,
frameworks, and databases.

**Do not invent technologies.**

All project claims must be technically defensible during a recruiter
interview.

## Known Accuracy Concerns

Remove or correct claims involving:

-   `DeepFace`
-   `SQLite`
-   `PennyLane`

unless the actual project source or verified portfolio information
confirms they were used.

## Face Recognition Attendance System

Do not falsely describe the project using DeepFace or SQLite if they
were not used.

The known project implementation includes technologies or concepts such
as:

-   Python
-   `face_recognition`
-   `dlib`
-   NumPy
-   Excel-based data storage
-   HOG / CNN / KNN-related face recognition discussion or
    implementation where accurate

Only include technologies that can be truthfully defended.

## Quantum EEG Project

Do not claim PennyLane unless it is genuinely used.

The known project direction includes:

-   CHB-MIT EEG dataset
-   MNE
-   EEG preprocessing
-   0.5--40 Hz band-pass filtering
-   EEG segmentation
-   Wavelet features
-   Shannon entropy
-   Power Spectral Density / Welch method
-   Hjorth mobility
-   Quantum classifier architecture
-   Qiskit / VQC / QML direction where actually implemented or
    accurately described

Clearly distinguish between:

-   completed implementation
-   current implementation
-   planned architecture

Do not describe planned work as already completed.

## General Content Rules

-   Do not fabricate metrics
-   Do not fabricate accuracy values
-   Do not fabricate frameworks
-   Do not fabricate deployment status
-   Do not fabricate client work
-   Do not fabricate GitHub URLs
-   Do not fabricate research claims

If a real GitHub URL is unavailable, clearly keep the project link
unavailable rather than linking to `#` as though it were functional.

A disabled or unavailable project link must have an honest UI state.

------------------------------------------------------------------------

# 4. Contact Form

The current fake success behaviour must be removed.

Do not use:

``` js
alert('Message sent successfully!');
```

unless a real message submission has successfully completed.

The interface must never tell a visitor that a message was sent when no
submission occurred.

## Required Contact Form Behaviour

Prepare the contact form for integration with a real external form
service such as:

-   Web3Forms
-   Formspree

Do not build an unnecessary custom backend solely for the portfolio
contact form.

If API keys, access keys, form IDs, or configuration credentials are
unavailable:

-   use a clearly named configuration placeholder
-   detect missing configuration
-   display an honest configuration/error state
-   do not display a false success state
-   document the exact configuration value the portfolio owner must
    provide

## Submission States

The form should support:

1.  idle
2.  submitting
3.  success
4.  error
5.  missing configuration, if applicable

Prevent repeated submissions while a request is already being processed.

Only show success after a confirmed successful response from the
configured form service.

------------------------------------------------------------------------

# 5. Codebase Cleanup

Inspect the complete dependency graph and runtime architecture before
deleting files.

Do not delete files merely because their names appear old.

## Legacy Architecture Review

Investigate whether the following are part of the active runtime:

-   `scenes/`
-   `experience/World.js`
-   `experience/Resources.js`
-   `experience/TransitionManager.js`

If dependency tracing confirms that these files are genuinely unused,
remove them.

If they are required by the active runtime, keep them.

## General Cleanup

-   remove genuinely unused imports
-   remove obsolete debug console output
-   remove abandoned code paths
-   remove dead commented code where it has no documentation value
-   preserve useful architectural comments
-   ensure naming remains consistent

## Repository Cleanup

Ensure `node_modules` is excluded through `.gitignore`.

Do not commit `node_modules`.

Review `.gitignore` for common generated files and local environment
files.

## Dependency Synchronization

Synchronize:

-   `package.json`
-   `package-lock.json`

A clean dependency installation should work.

Verify using the appropriate clean installation workflow.

The project should not depend on an inconsistent local `node_modules`
state.

## Production Build

Run the production build.

Fix actual build errors.

Report warnings honestly.

If the build reports a large JavaScript bundle or chunk warning:

-   inspect the cause
-   apply safe code splitting or lazy loading only where architecturally
    appropriate
-   do not over-engineer the project merely to remove a warning
-   do not damage the single-renderer experience architecture

Performance improvements must preserve the intended cinematic
experience.

------------------------------------------------------------------------

# 6. Preservation Rules

These rules are mandatory.

## Do Not

-   rebuild the portfolio from scratch
-   replace the current architecture merely for stylistic preference
-   restore Whirlpool / NAVIGATE
-   add an eighth chapter
-   change the current 7-chapter order
-   change `01 / 07` back to `01 / 08`
-   replace the shared particle system
-   create multiple WebGL renderers
-   create multiple independent animation loops
-   create multiple canvases for chapter effects
-   create a separate Three.js application for each chapter
-   redesign the entire UI
-   remove working behaviour without a technical reason
-   invent portfolio project information
-   fabricate links or credentials

## Preserve

-   the current 7-chapter narrative
-   the shared particle system
-   the current formation architecture
-   the single-renderer architecture
-   the single animation loop
-   the current quality-tier concept
-   existing working chapter navigation
-   existing working responsive behaviour unless improvement is required
-   the overall visual identity of the portfolio

------------------------------------------------------------------------

# 7. Implementation Approach

Before modifying code:

1.  inspect the current project structure
2.  identify the active application entry point
3.  trace the runtime dependency graph
4.  identify the active renderer, scene, camera, composer, and animation
    loop
5.  identify how `TransitionDirector` and `FormationController`
    communicate
6.  identify the chapter configuration source
7.  identify the active project-content data source
8.  identify the contact form implementation
9.  identify legacy or unused modules
10. run the current build and record existing warnings or errors

Only after this inspection should implementation begin.

Do not blindly rewrite files.

Prefer focused modifications to the current working architecture.

------------------------------------------------------------------------

# 8. Verification Requirements

After implementation, verify all seven chapters.

Test every forward transition:

1.  GRAVITY → ORBIT
2.  ORBIT → DISTORT
3.  DISTORT → SYSTEMS
4.  SYSTEMS → STRUCTURE
5.  STRUCTURE → ADAPT
6.  ADAPT → CONNECT

Also test reverse navigation if the portfolio supports reverse chapter
movement.

Verify:

-   particle formations resolve correctly
-   transitions do not leave stale shader state
-   distortion effects reset after completion
-   camera state remains valid
-   pointer parallax does not accumulate drift
-   mobile interaction remains usable
-   reduced-motion behaviour works
-   contact form does not show false success
-   unavailable project links are honestly represented
-   no deleted legacy module is still imported
-   clean dependency installation works
-   production build succeeds

------------------------------------------------------------------------

# 9. Required Final Implementation Report

After completing the task, provide a concise implementation report.

Use the following structure:

## Files Modified

List every modified file and briefly state why it changed.

## Files Removed

List every removed file.

For each removed legacy file or directory, confirm that dependency
tracing showed it was unused.

## Transition Effects Implemented

For each chapter transition, state the effect that was **actually
implemented**.

Do not claim an effect was implemented if only a fade or ordinary
particle interpolation remains.

## Parallax Implementation

Explain:

-   pointer input handling
-   damping/interpolation approach
-   affected depth layers
-   mobile behaviour
-   reduced-motion behaviour

## Portfolio Content Corrections

List inaccurate technology, framework, database, algorithm, metric, or
project claims that were removed or corrected.

## Contact Form Status

State:

-   selected form service
-   whether real submission is active
-   required configuration values
-   success/error behaviour

If credentials are still required, state this clearly.

## Build Result

Provide:

-   clean installation result
-   production build result
-   remaining warnings

## Remaining Owner Actions

List only actions that require input from the portfolio owner, such as:

-   Web3Forms access key
-   Formspree form ID
-   verified GitHub project URL
-   missing factual project information

Do not hide incomplete work.

------------------------------------------------------------------------

# Final Instruction

Treat this file as the authoritative implementation specification for
this correction task.

The objective is to **polish and upgrade the existing portfolio**, not
replace it.

Preserve the strong architecture that already exists.

Implement the missing cinematic depth, improve transition quality,
correct inaccurate portfolio claims, make the contact experience honest,
clean the repository, and verify the production build.

**Do not mark a requirement as completed unless it is actually
implemented and verified.**
