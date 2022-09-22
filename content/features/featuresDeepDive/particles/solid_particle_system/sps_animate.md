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

To animate the particles you need to reset and draw them on each render cycle, for example with

```javascript
scene.onBeforeRenderObservable.add(() => {
  SPS.setParticles();
});
```

As said previously all behaviors of solid particles have to be implemented by yourself. This includes using a billboard mode. You set this using

```javascript
SPS.billboard = true; //false by default
```

The required rotation for the mesh to face the camera has to be calculated each render frame so the above render loop needs to be added.

Billboard set to true, comment line 35 for false: <Playground id="#GLZ1PX#6" title="Solid Particle Billboards" description="Simple example of solid particle billboards"/>

To achieve an animation of solid particles their properties have to be updated render frame by render frame. To do this you need to code a custom _myUpdateParticle(particle)_. You can then set

```javascript
SPS.updateParticle = myUpdateParticle;
```

This is sufficient since _setParticles_ calls _updateParticle_.

Let's make some tetrahedrons bounce up and down. We just use a cos function to produce varying heights.

```javascript
let y = h * (1 + Math.cos(angle));
```

will give y from 0 to 2h as the angle varies.

Bouncing tetrahedrons: <Playground id="#GLZ1PX#7" title="Bouncing Tetrahedrons" description="Simple example of bouncing tetrahedrons."/>
Bouncing tetrahedrons SPS mesh rotating: <Playground id="#GLZ1PX#8" title="Bouncing Tetrahedrons With Meshes Rotating" description="Simple example of bouncing tetrahedrons with meshes rotating."/>

Another very useful custom function to create is _recycle(particle)_ and call this from _updateParticle_ on some condition, for example

```javascript
const updateParticle = (particle) => {
    if (particle condition) {
        recycleParticle(particle)
    }
    doUpdate(particle);
}
```

A fountain of recycled tetrahedra: <Playground id="#GLZ1PX#9" title="A Fountain Of Recycled Tetrahedra" description="Simple example of a fountain of recycled tetrahedra."/>

Before moving on much further it is time to pull together in one place all the features of managing the SPS and its particles.
