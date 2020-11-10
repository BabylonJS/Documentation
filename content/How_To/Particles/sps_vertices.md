---
title: Updating A Solid Particle's Shape
image: 
description: Learn how to change a solid particles shape in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles, vertices
further-reading:
video-overview:
video-content:
---

# Update a Particle's Shape

- `SPS.updateParticleVertex()` _usage_ :  
  It happens before particle scaling, rotation and translation and it allows to update the vertex coordinates, color and UV of each particle.  
  This function will be called for each vertex of each particle and it will be passed the current particle, the current vertex and its current index in the particle shape.  
  The vertex is a SolidParticleVertex object, so you can access or set its properties :
  ```javascript
  vertex.position: Vector3 (x, y, z)
  vertex.color: Color4 (r, g, b, a)
  vertex.uv: Vector2 (x, y)
  ```

```javascript
SPS.computeParticleVertex = true; // false by default for performance reason
SPS.updateParticleVertex = function(particle, vertex, v) {
  // particle : the current particle object
  // vertex : the current vertex, a solidParticleVertex object
  // the index of the current vertex in the particle shape
  // example :
  if (particle.shapeID == 1) {
    vertex.position.x *= Math.random() + 1;
    vertex.position.y *= Math.random() + 1;
    vertex.position.z *= Math.random() + 1;
    vertex.color.r = Math.abs(Math.sin(v));
    vertex.color.g = 1 - vertex.color.r
    vertex.uv.x = particle.idx + v;
    vertex.uv.y = vertex.uv.x;
  }

};
```

Note well that this vertex update is not stored (the particle shape isn't modified) but just computed in the next call to `setParticles()`. So there is no value accumulation : the vertex coordinates, colors or UVs are always the initial ones when entering this function.  
Note also that the shape reference for each particle is the original shape of the mesh model you passed in `addShape()`, even if you had passed also a custom `vertexFunction` (see in the part : "Going furhter in immutable SPS").  
The good news is that the very same function can be use for `SPS.updateParticleVertex` and for the custom `vertexFunction` expected by `addShape()`.  
So to better understand how it works, here is another global pseudo-code schema :

```javascript
var particles: SolidParticles[] = [array of SolidParticle objects];
function setParticles() {
    beforeUpdateParticles();                 // your custom function
    for (var p = 0; p < nbParticles; p++) {
      var particle = particles[p];
      updateParticles(particle);             // your custom position function
      for(var v = 0; particle.vertices.length; v++) {
        var vertex = particle.vertices[v];
        updateParticleVertex(particle, vertex, v);   // your ustom vertex function
        computeAllTheVertexStuff();
      }
    }
    updateTheWholeMesh();                   // does the WebGL work
    afterUpdateParticles();                 // your ustom function
}
```

Example: <Playground id="#1X7SUN#11" title="Updating Solid Particle Geometry" description="Simple example of manipulating solid particle geometry." image=""/>
or dancing glow-worms: <Playground id="#1X7SUN#12" title="Dancing Glow Worm Solid Particles" description="Fun Glow Worm example of changing solid particle geometry." image=""/>