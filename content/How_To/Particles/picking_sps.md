# Pickable Particles

You can set your particles as pickable with the parameter `isPickable` (default _false_) when creating your SPS :

```javascript
var SPS = new BABYLON.SolidParticleSystem("SPS", scene, { isPickable: true });
```

This will set the underlying mesh as pickable and populate two arrays called `SPS.pickedParticles` and `SPS.pickebBySubMesh`. So, don't set your SPS as pickable if you don't need it to be, this will save much memory.  
In order to retrieve the particle picking data from these arrays, use the method `SPS.pickedParticle(pickingInfo)` that returns an object with these properties :

- `idx` : the picked particle idx
- `faceId` : the face index of the picked particle (counted within this particle)

Example :

```javascript
var SPS = new BABYLON.SolidParticleSystem("SPS", scene, { isPickable: true });
// add shapes, build the mesh, init particles, etc
SPS.setParticles(); // initial SPS draw
SPS.refreshVisibleSize(); // force the BBox recomputation
scene.onPointerDown = function(evt, pickResult) {
  var meshFaceId = pickResult.faceId; // get the mesh picked face
  if (meshFaceId == -1) {
    return;
  } // return if nothing picked
  var picked = SPS.pickedParticle(pickResult); // get the picked particle data : idx and faceId
  var idx = picked.idx;                         
  var p = SPS.particles[idx];                   // get the actual picked particle
  p.color.r = 1; // turn it red
  p.color.b = 0;
  p.color.g = 0;
  p.velocity.y = -1; // drop it
  SPS.setParticles();
};
```

The SPS pickability is directly related to the size of its bounding box (please read 'SPS Visibility' part). So, in order to make sure your particles will be pickable, don't forget to force, at least once, the bounding box size recomputation once the particles are set in the space with `setParticles()`.  
Pickable particle example (no SPS update in the render loop) : https://www.babylonjs-playground.com/#2FPT1A#351    
Pickable particle example (particle rotation) : https://www.babylonjs-playground.com/#2FPT1A#352  