# Solid Particle Animation

To animate the particles you need to reset and draw them on each render cycle, for example with

```javascript
scene.onBeforeRenderObservable.add(() => {
    SPS.setParticles();
})
```

As said previously all behaviors of solid particles have to be implemented by yourself. This includes using a billboard mode. You set this using

```javascript
SPS.billboard = true; //false by default
```
The required rotation for the mesh to face the camera has to be calculated each render frame so the above render loop needs to be added.

Billboard set to true, comment line 35 for false https://www.babylonjs-playground.com/#GLZ1PX#6

To achieve an animation of solid particles their properties have to be updated render frame by render frame. To do this you need to code a custom *myUpdateParticle(particle)*. You can then set 

```javascript
SPS.updateParticle = myUpdateParticle
```

This is sufficient since *setParticles* calls *updateParticle*.

Let's make some tetrahedrons bounce up and down. We just use a cos function to produce varying heights.

```javascript
let y = h * (1 + Math.cos(angle))
```

will give y from 0 to 2h as the angle varies.

Bouncing tetrahedrons https://www.babylonjs-playground.com/#GLZ1PX#7  
Bouncing tetrahedrons SPS mesh rotating https://www.babylonjs-playground.com/#GLZ1PX#8

Another very useful custom function to create is *recycle(particle)* and call this from *updateParticle* on some condition, for example

```javascript
const updateParticle = (particle) => {
    if (particle condition) {
        recycleParticle(particle)
    }
    doUpdate(particle);
}
```

A fountain of recycled tetrahedra https://www.babylonjs-playground.com/#GLZ1PX#9

Before moving on much further it is time to pull together in one place all the features of managing the SPS and its particles.