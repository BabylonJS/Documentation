---
title: Solid Particle Animation
image: 
description: Learn all about animating solid particles in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles, animation
further-reading:
video-overview:
video-content:
---

# Solid Particle Animation

To animate the particles, you need to reset and draw them on each render cycle, for example with

```javascript
scene.onBeforeRenderObservable.add(() => {
    SPS.setParticles();
})
```

As mentioned previously, all solid particle behaviors have to be implemented by you. This includes using billboard mode. You can set it using

```javascript
SPS.billboard = true; //false by default
```
The required rotation for the mesh to face the camera has to be calculated on each render frame, so the render loop above needs to be added.

Billboard set to true, comment line 35 for false: <Playground id="#GLZ1PX#6" title="Solid Particle Billboards" description="Simple example of solid particle billboards"/>

To animate solid particles, their properties have to be updated frame by frame during rendering. To do this, you need to code a custom *myUpdateParticle(particle)*. You can then set 

```javascript
SPS.updateParticle = myUpdateParticle
```

This is sufficient because *setParticles* calls *updateParticle*.

Let's make some tetrahedrons bounce up and down. We use a cosine function to produce varying heights.

```javascript
let y = h * (1 + Math.cos(angle))
```

will give y from 0 to 2h as the angle varies.

Bouncing tetrahedrons: <Playground id="#GLZ1PX#7" title="Bouncing Tetrahedrons" description="Simple example of bouncing tetrahedrons."/>
Bouncing tetrahedrons SPS mesh rotating: <Playground id="#GLZ1PX#8" title="Bouncing Tetrahedrons With Meshes Rotating" description="Simple example of bouncing tetrahedrons with meshes rotating."/>

Another very useful custom function is *recycle(particle)*, which you call from *updateParticle* under some condition, for example

```javascript
const updateParticle = (particle) => {
    if (particle condition) {
        recycleParticle(particle)
    }
    doUpdate(particle);
}
```

A fountain of recycled tetrahedra: <Playground id="#GLZ1PX#9" title="A Fountain Of Recycled Tetrahedra" description="Simple example of a fountain of recycled tetrahedra."/>

Before moving much further, it is time to bring together in one place all the features for managing the SPS and its particles.